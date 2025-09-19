// Service Worker for Net2Sheet Chrome Extension
// 現在は特別な処理は不要ですが、将来的な拡張のためにファイルを保持

chrome.runtime.onInstalled.addListener(() => {
  console.log("Net2Sheet extension installed");
});

// 拡張機能のアクティベート時の処理（オプション）
chrome.runtime.onStartup.addListener(() => {
  console.log("Net2Sheet extension started");
});
