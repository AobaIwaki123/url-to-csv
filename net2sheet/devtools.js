/ 画像拡張子の判定（クエリは切ってpathnameの拡張子を見る）
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".bmp", ".ico"]);

let collecting = false;
let rows = []; // [ [name, url], ... ]

const $ = (id) => document.getElementById(id);
const updateView = () => {
  $("count").textContent = String(rows.length);
  $("preview").value = rows.map(r => r.map(v => `"${(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
};

// 設定の保存/復元
chrome.storage.local.get(["gasUrl"], ({ gasUrl }) => { $("gasUrl").value = gasUrl || ""; });
$("save").onclick = () => {
  chrome.storage.local.set({ gasUrl: $("gasUrl").value.trim() });
};

// CSVダウンロード
$("exportCsv").onclick = () => {
  const header = [["name", "request_url"]];
  const all = header.concat(rows);
  const csv = all.map(r => r.map(v => `"${(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "network_images.csv"; a.click();
  URL.revokeObjectURL(url);
};

// スプレッドシートへ送信（GAS）
$("send").onclick = async () => {
  const gasUrl = $("gasUrl").value.trim();
  if (!gasUrl) { alert("GASのWebApp URLを設定してください"); return; }
  if (rows.length === 0) { alert("送信するデータがありません"); return; }
  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 必要に応じて credentials: "include" も検討
      body: JSON.stringify({ rows })
    });
    const data = await res.json();
    alert(`送信結果: ${JSON.stringify(data)}`);
  } catch (e) {
    alert(`送信エラー: ${e}`);
  }
};

// 拾う/止める
$("start").onclick = () => { collecting = true; };
$("stop").onclick = () => { collecting = false; };

// DevToolsのNetworkイベント
chrome.devtools.network.onRequestFinished.addListener((req) => {
  if (!collecting) return;

  const name = req.request?.url ? (new URL(req.request.url)).pathname.split("/").pop() || "" : (req.request?.url || "");
  const url = req.request?.url || "";

  // レスポンスが画像MIMEなら確実だが、ここでは拡張子で手早くフィルタ
  try {
    const u = new URL(url);
    const pathname = u.pathname.toLowerCase();
    const ext = pathname.slice(pathname.lastIndexOf("."));
    if (!IMAGE_EXTS.has(ext)) return; // 拡張子判定
  } catch {
    return;
  }

  // ここで name, url を蓄積
  rows.push([name, url]);
  updateView();
});

// タブをまたいだら初期化したい場合は適宜 rows = [] をクリア
chrome.devtools.network.onNavigated.addListener(() => {
  // rows = [];
  // updateView();
});
