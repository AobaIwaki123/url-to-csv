了解です。**普段のブラウザ操作のまま**、

1. DevToolsのNetwork相当の情報を取得
2. 画像拡張子だけをフィルタ
3. CSV化
4. Googleスプレッドシートへ書き込み

までやる\*\*Chrome拡張（MV3 + DevTools拡張）\*\*の最小構成を用意します。
スプレッドシートへの書き込みは、**Google Apps Script（GAS）のWebアプリ**を受け口にするのが一番手軽です（OAuth/Identityの実装を回避できる）。

---

# 手順の全体像

* ① GASをデプロイ（POSTを受けてシートに追記）
* ② Chrome拡張をインストール（DevToolsの専用パネルから収集→GASへ送信）

---

# ① Google Apps Script（受け口）

1. 新しいスクリプトを作成し、以下を貼り付け
2. スプレッドシートIDとシート名を設定
   1. リクエストボディでスプレッドシートIDとシート名を設定できるようにしたい
3. 「デプロイ」→「新しいデプロイ」→「種類：ウェブアプリ」→「アクセス権：全員（匿名）」 or 「全員」
   ※匿名を避けたい場合は自分のGoogleアカウント限定にして、拡張側で`credentials: "include"`にする運用も可

```javascript
// Code.gs
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents); // { rows: [ [name, url], ... ] }
    const rows = body?.rows || [];
    if (!rows.length) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, inserted: 0 }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    // 見出しが無ければ付ける
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["name", "request_url"]);
    }
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 2).setValues(rows);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, inserted: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

* デプロイ後に表示される **WebアプリURL** を控えておきます（例：`https://script.google.com/macros/s/.../exec`）。

---

# ② Chrome拡張（MV3 + DevTools拡張）

## ファイル構成

```
net2sheet/
├─ manifest.json
├─ devtools.html
├─ devtools.js
└─ service_worker.js
```

## manifest.json

```json
{
  // Chrome拡張のマニフェストバージョン
  // 現在は必ず3 (Manifest V3) を指定
  "manifest_version": 3,

  // 拡張機能の名前。Chrome拡張一覧やインストール時に表示される
  "name": "Net2Sheet",

  // バージョン番号。ストアや更新時に管理される
  "version": "0.1.0",

  // 拡張の概要。Chromeの拡張管理画面やストアで表示される
  "description": "DevToolsのNetworkから画像リクエスト(name, url)を収集し、CSV化＆スプレッドシートに送信",

  // 拡張が要求する権限
  // - "storage": chrome.storage APIで設定を保存/読み込み
  // - "scripting": 後で必要に応じてコンテントスクリプト等を注入できる
  "permissions": ["storage", "scripting"],

  // アクセスを許可するホスト（URL）の範囲
  // "<all_urls>" はすべてのURLに対して動作可能にする設定
  "host_permissions": ["<all_urls>"],

  // 拡張のバックグラウンド処理を行うService Worker
  // 永続的には動作せず、必要なときに起動される
  "background": {
    "service_worker": "service_worker.js"
  },

  // DevTools専用の拡張ページを指定
  // このHTMLが読み込まれると、DevToolsにカスタムパネルが追加される
  "devtools_page": "devtools.html",

  // 拡張のアイコン（16, 48, 128ピクセル）
  // Chrome拡張一覧やストア、通知などに表示される
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

※ アイコンはダミーでOK（なくても動きます）

## devtools.html

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Net2Sheet</title>
    <style>
      body { font-family: ui-sans-serif, system-ui; padding: 10px; }
      textarea { width: 100%; height: 120px; }
      button { margin-right: 8px; }
      .row { margin: 8px 0; }
    </style>
  </head>
  <body>
    <div class="row">
      <label>GAS WebApp URL: <input id="gasUrl" style="width:60%"></label>
      <button id="save">保存</button>
    </div>
    <div class="row">
      <button id="start">収集開始</button>
      <button id="stop">収集停止</button>
      <button id="exportCsv">CSVダウンロード</button>
      <button id="send">スプレッドシートへ送信</button>
    </div>
    <div class="row">
      <strong>収集件数:</strong> <span id="count">0</span>
    </div>
    <div class="row">
      <textarea id="preview" placeholder="name,url のプレビュー"></textarea>
    </div>
    <script src="devtools.js"></script>
  </body>
</html>
```

## devtools.js

```javascript
// 画像拡張子の判定（クエリは切ってpathnameの拡張子を見る）
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
```

## service\_worker.js

```javascript
// ここでは特別な処理は不要（将来、`chrome.debugger`等を使う場合に利用）
```

---

# 使い方

1. GASをデプロイして**WebアプリURL**を取得
2. 上記拡張を「パッケージ化されていない拡張機能を読み込む」で読み込み
3. 対象サイトを開いて**DevToolsを起動** → 上部タブに「Net2Sheet」パネルが出ます
4. パネルで GAS URL を保存 →「収集開始」を押す
5. 通常どおりページを操作（Networkの通信が走る）
6. 「CSVダウンロード」 or 「スプレッドシートへ送信」を実行

---

# 補足（より厳密にやりたい場合）

* **MIMEで判定**：`req.getContent`や`req.response.headers`を見て `image/*` を判定すると拡張子に依らず堅いです。
* **DevToolsを開かずに取得したい**：`chrome.debugger`でCDPをタブにアタッチし、`Network.responseReceived`を購読 → `Network.getResponseBody`も可。
* **機密の扱い**：URLにトークン/個人情報が含まれる場合は**マスキング**・**ドメインホワイトリスト**などを入れてください。

---

必要なら、**MIME判定版**や\*\*`chrome.debugger`版\*\*、**Playwright/Python版**（自動ブラウザ + Sheets API）もすぐに出します。ご希望のスタックに合わせて調整します。
