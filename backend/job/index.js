"use strict";

/*
 Cloud Run Job: Read latest CSV from GCS and append to Google Sheets
 Env:
  - GCS_BUCKET
  - SHEET_ID
  - SHEET_RANGE (e.g. Sheet1!A1)
*/

const { Storage } = require("@google-cloud/storage");
const { google } = require("googleapis");
const csvParse = require("csv-parse/sync");

async function main() {
  const bucketName = process.env.GCS_BUCKET;
  const sheetId = process.env.SHEET_ID;
  const sheetRange = process.env.SHEET_RANGE || "Sheet1!A1";

  if (!bucketName || !sheetId) {
    throw new Error("Missing env GCS_BUCKET or SHEET_ID");
  }

  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const [files] = await bucket.getFiles({ prefix: "uploads/" });
  if (!files || files.length === 0) {
    console.log("No files to process");
    return;
  }

  // pick most recent
  files.sort((a, b) =>
    (b.metadata?.timeCreated || "").localeCompare(a.metadata?.timeCreated || "")
  );
  const latest = files[0];
  console.log(`Processing: ${latest.name}`);

  const [contents] = await latest.download();
  const csvText = contents.toString("utf8");

  const records = csvParse.parse(csvText, { relaxQuotes: true });

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // Append rows
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: sheetRange,
    valueInputOption: "RAW",
    requestBody: { values: records },
  });

  console.log("Append complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
