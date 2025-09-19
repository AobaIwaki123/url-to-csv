// Net2Sheet Options Page - Configuration and Authentication
// Implements IMPLEMENTATION-PLAN.md JWT auth pattern

const $ = (id) => document.getElementById(id);

// DOM Elements
const backendUrlInput = $("backendUrl");
const gasUrlInput = $("gasUrl");
const usernameInput = $("username");
const passwordInput = $("password");
const authIndicator = $("authIndicator");
const authText = $("authText");
const loginForm = $("loginForm");
const logoutSection = $("logoutSection");

// Status display helper
const showStatus = (elementId, message, type = "info") => {
  const element = $(elementId);
  element.textContent = message;
  element.className = `status ${type}`;
  element.style.display = "block";

  // Auto-hide after 3 seconds for success messages
  if (type === "success") {
    setTimeout(() => {
      element.style.display = "none";
    }, 3000);
  }
};

// Load saved settings
const loadSettings = async () => {
  try {
    const { backendUrl, gasUrl } = await chrome.storage.local.get([
      "backendUrl",
      "gasUrl",
    ]);

    if (backendUrl) backendUrlInput.value = backendUrl;
    if (gasUrl) gasUrlInput.value = gasUrl;

    // Check authentication status
    await updateAuthStatus();
  } catch (e) {
    showStatus("backendStatus", `設定読み込みエラー: ${e.message}`, "error");
  }
};

// Update authentication status display
const updateAuthStatus = async () => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_AUTH_STATUS",
    });

    if (response.ok && response.authenticated) {
      authIndicator.classList.add("authenticated");
      authText.textContent = "認証済み";
      loginForm.style.display = "none";
      logoutSection.style.display = "block";
    } else {
      authIndicator.classList.remove("authenticated");
      authText.textContent = "未認証";
      loginForm.style.display = "block";
      logoutSection.style.display = "none";
    }
  } catch (e) {
    authText.textContent = "認証状態不明";
    showStatus("authStatus", `認証状態確認エラー: ${e.message}`, "error");
  }
};

// Save backend URL
$("saveBackendUrl").onclick = async () => {
  const url = backendUrlInput.value.trim();

  if (!url) {
    showStatus("backendStatus", "URLを入力してください", "error");
    return;
  }

  try {
    new URL(url); // Validate URL format
    await chrome.storage.local.set({ backendUrl: url });
    showStatus("backendStatus", "バックエンドURL保存完了", "success");
  } catch (e) {
    showStatus("backendStatus", "無効なURL形式です", "error");
  }
};

// Save GAS URL
$("saveGasUrl").onclick = async () => {
  const url = gasUrlInput.value.trim();

  if (!url) {
    showStatus("gasStatus", "URLを入力してください", "error");
    return;
  }

  try {
    new URL(url); // Validate URL format
    await chrome.storage.local.set({ gasUrl: url });
    showStatus("gasStatus", "GAS URL保存完了", "success");
  } catch (e) {
    showStatus("gasStatus", "無効なURL形式です", "error");
  }
};

// Login
$("loginBtn").onclick = async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showStatus(
      "authStatus",
      "ユーザー名とパスワードを入力してください",
      "error"
    );
    return;
  }

  if (!backendUrlInput.value.trim()) {
    showStatus("authStatus", "先にバックエンドURLを設定してください", "error");
    return;
  }

  $("loginBtn").disabled = true;
  $("loginBtn").textContent = "ログイン中...";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "LOGIN",
      username,
      password,
    });

    if (response.ok) {
      showStatus("authStatus", response.message || "ログイン成功", "success");
      await updateAuthStatus();
    } else {
      showStatus(
        "authStatus",
        response.message || "ログインに失敗しました",
        "error"
      );
    }
  } catch (e) {
    showStatus("authStatus", `ログインエラー: ${e.message}`, "error");
  } finally {
    $("loginBtn").disabled = false;
    $("loginBtn").textContent = "ログイン";
  }
};

// Logout
$("logoutBtn").onclick = async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: "LOGOUT" });

    if (response.ok) {
      showStatus("authStatus", response.message || "ログアウト完了", "success");
      await updateAuthStatus();
    } else {
      showStatus("authStatus", "ログアウトに失敗しました", "error");
    }
  } catch (e) {
    showStatus("authStatus", `ログアウトエラー: ${e.message}`, "error");
  }
};

// Test GAS connection
$("testGas").onclick = async () => {
  const gasUrl = gasUrlInput.value.trim();

  if (!gasUrl) {
    showStatus("testResult", "GAS URLを入力してください", "error");
    return;
  }

  $("testGas").disabled = true;
  $("testGas").textContent = "テスト中...";

  try {
    const testData = { rows: [["test", "connection"]] };
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const result = await response.text();
      showStatus("testResult", `GAS接続成功: ${result}`, "success");
    } else {
      showStatus("testResult", `GAS接続失敗: ${response.status}`, "error");
    }
  } catch (e) {
    showStatus("testResult", `GAS接続エラー: ${e.message}`, "error");
  } finally {
    $("testGas").disabled = false;
    $("testGas").textContent = "GAS接続テスト";
  }
};

// Enter key support for login form
usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") passwordInput.focus();
});

passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") $("loginBtn").click();
});

// Initialize page
document.addEventListener("DOMContentLoaded", loadSettings);
