/*
 Cloud Run Service: Accept CSV uploads, save to GCS, trigger Cloud Run Job
 Auth: Bearer JWT (HS256) using JWT_SECRET
*/

"use strict";

// パッケージのimport
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { Storage } = require("@google-cloud/storage");
const { google } = require("googleapis");

const app = express();
app.use(express.json());
app.use(
  express.text({
    type: ["text/*", "application/csv", "application/octet-stream"],
    limit: "20mb",
  })
);
app.use(helmet({ contentSecurityPolicy: false }));

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.length === 0) return cb(null, true);
      if (
        ALLOWED_ORIGINS.some(
          (allow) => allow === "*" || origin.startsWith(allow)
        )
      )
        return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Rate limiting: 60秒間に120回までのリクエストを許可
const limiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const REQUIRED_ENV = [
  "JWT_SECRET",
  "GCS_BUCKET",
  "JOB_LOCATION", // e.g. us-central1
  "JOB_NAME", // e.g. csv-to-sheets-job
];

for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    // eslint-disable-next-line no-console
    console.error(`Missing env ${k}`);
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "change_me_for_dev_only";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const GCS_BUCKET = process.env.GCS_BUCKET;
const JOB_LOCATION = process.env.JOB_LOCATION;
const JOB_NAME = process.env.JOB_NAME;

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "missing_bearer" });
  try {
    const decoded = jwt.verify(m[1], JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

const storage = new Storage();

app.get("/healthz", (req, res) => res.json({ ok: true }));

// JWT Authentication endpoint - implements IMPLEMENTATION-PLAN.md login flow
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  // Demo credentials (in production, use DB or IdP integration)
  if (username === "demo" && password === "net2sheet2025") {
    const token = jwt.sign({ sub: username, role: "user" }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.json({
      token,
      expiresIn: JWT_EXPIRES_IN,
      message: "ログイン成功",
    });
  }

  return res.status(401).json({
    error: "invalid_credentials",
    message: "ユーザー名またはパスワードが正しくありません",
  });
});

// POST /upload  Body: raw CSV text
app.post("/upload", authMiddleware, async (req, res) => {
  try {
    const csvText = typeof req.body === "string" ? req.body : "";
    if (!csvText || csvText.trim().length === 0) {
      return res.status(400).json({ error: "empty_csv" });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    const objectName = `uploads/${timestamp}.csv`;

    const bucket = storage.bucket(GCS_BUCKET);
    const file = bucket.file(objectName);
    await file.save(csvText, {
      contentType: "text/csv",
      resumable: false,
      metadata: {
        metadata: { source: "net2sheet", uploadedAt: new Date().toISOString() },
      },
    });

    // Trigger Cloud Run Job execution
    const execution = await runJob();

    return res.json({
      ok: true,
      gcsUri: `gs://${GCS_BUCKET}/${objectName}`,
      execution,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res
      .status(500)
      .json({ error: "upload_failed", detail: String(e.message || e) });
  }
});

async function runJob() {
  // Uses Google Cloud API to start a Cloud Run Job execution
  // Auth via default service account of Cloud Run service
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const projectId = await google.auth.getProjectId();
  const url = `https://run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${projectId}/jobs/${JOB_NAME}:run?location=${encodeURIComponent(
    JOB_LOCATION
  )}`;
  const res = await auth.request({ url, method: "POST" });
  return res.data || null;
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Service listening on :${port}`);
});
