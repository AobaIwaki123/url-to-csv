// Service Worker for Net2Sheet Chrome Extension
// JWT token management and API proxy (IMPLEMENTATION-PLAN.md pattern)

// JWT token storage using session storage (cleared on browser restart)
async function getToken() {
  const { token } = await chrome.storage.session.get(["token"]);
  return token || null;
}

async function setToken(token) {
  await chrome.storage.session.set({ token });
}

async function clearToken() {
  await chrome.storage.session.remove(["token"]);
}

// Message handler for extension communication
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "LOGIN") {
        const backendUrl = await getBackendUrl();
        if (!backendUrl) {
          return sendResponse({
            ok: false,
            error: "backend_url_not_set",
            message: "バックエンドURLが設定されていません",
          });
        }

        const resp = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: msg.username,
            password: msg.password,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          return sendResponse({
            ok: false,
            error: err.error || "login_failed",
            message: err.message || "ログインに失敗しました",
          });
        }

        const data = await resp.json();
        await setToken(data.token);
        return sendResponse({
          ok: true,
          message: data.message || "ログイン成功",
        });
      }

      if (msg.type === "UPLOAD_CSV") {
        const token = await getToken();
        if (!token) {
          return sendResponse({
            ok: false,
            error: "not_logged_in",
            message: "ログインが必要です",
          });
        }

        const backendUrl = await getBackendUrl();
        if (!backendUrl) {
          return sendResponse({
            ok: false,
            error: "backend_url_not_set",
            message: "バックエンドURLが設定されていません",
          });
        }

        const resp = await fetch(`${backendUrl}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/csv",
          },
          body: msg.csvData,
        });

        const text = await resp.text();
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {}

        return sendResponse({
          ok: resp.ok,
          status: resp.status,
          data: json ?? text,
          message: json?.error ? `エラー: ${json.error}` : "アップロード完了",
        });
      }

      if (msg.type === "LOGOUT") {
        await clearToken();
        return sendResponse({ ok: true, message: "ログアウトしました" });
      }

      if (msg.type === "GET_AUTH_STATUS") {
        const token = await getToken();
        return sendResponse({
          ok: true,
          authenticated: !!token,
        });
      }

      return sendResponse({
        ok: false,
        error: "unknown_message",
        message: "不明なメッセージタイプです",
      });
    } catch (e) {
      return sendResponse({
        ok: false,
        error: String(e),
        message: `エラー: ${e.message || e}`,
      });
    }
  })();

  // Return true for async response
  return true;
});

// Helper function to get backend URL from storage
async function getBackendUrl() {
  const { backendUrl } = await chrome.storage.local.get(["backendUrl"]);
  return backendUrl || null;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Net2Sheet extension installed");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Net2Sheet extension started");
});
