// 画像拡張子の判定（クエリは切ってpathnameの拡張子を見る）
const IMAGE_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".bmp",
  ".ico",
]);

let collecting = false;
let rows = []; // [ [name, url], ... ]

const $ = (id) => document.getElementById(id);

// ===== CSV フォーマット処理 =====

/**
 * CSV用に値をエスケープする
 * @param {string} value - エスケープする値
 * @returns {string} エスケープされた値
 */
const csvEscape = (value) => `"${(value ?? "").replace(/"/g, '""')}"`;

/**
 * 配列をCSV行に変換する
 * @param {Array} row - CSV行の配列
 * @returns {string} CSV形式の行
 */
const csvRow = (row) => row.map(csvEscape).join(",");

/**
 * 画像データをCSV形式に変換する
 * @param {Array<Array>} imageRows - 画像データの配列 [[name, url], ...]
 * @param {Object} options - オプション設定
 * @param {Array<string>} options.headers - CSVヘッダー（デフォルト: 日本語）
 * @param {boolean} options.includeHeaders - ヘッダーを含めるか（デフォルト: true）
 * @returns {string} CSV形式の文字列
 */
const generateCSV = (imageRows, options = {}) => {
  const { headers = ["ファイル名", "URL"], includeHeaders = true } = options;

  const rows = [];

  // ヘッダー追加
  if (includeHeaders) {
    rows.push(csvRow(headers));
  }

  // データ行追加
  imageRows.forEach((row) => {
    rows.push(csvRow(row));
  });

  return rows.join("\n");
};

/**
 * CSV用のファイル名を生成する
 * @param {string} prefix - ファイル名のプレフィックス（デフォルト: "network_images"）
 * @param {Date} date - 日付オブジェクト（デフォルト: 現在時刻）
 * @returns {string} タイムスタンプ付きファイル名
 */
const generateCSVFilename = (prefix = "network_images", date = new Date()) => {
  const timestamp = date.toISOString().slice(0, 19).replace(/[T:]/g, "_");
  return `${prefix}_${timestamp}.csv`;
};
const updateView = () => {
  $("count").textContent = String(rows.length);

  // プレビュー表示（ヘッダー付き）
  if (rows.length > 0) {
    $("preview").value = generateCSV(rows);
  } else {
    $("preview").value = "";
  }
};

// 設定の保存/復元
chrome.storage.local.get(["gasUrl"], ({ gasUrl }) => {
  $("gasUrl").value = gasUrl || "";
});
$("save").onclick = () => {
  chrome.storage.local.set({ gasUrl: $("gasUrl").value.trim() });
};

// CSVダウンロード
$("exportCsv").onclick = () => {
  // データ検証
  if (rows.length === 0) {
    alert(
      "CSVに出力するデータがありません。\n「収集開始」ボタンを押してネットワーク監視を開始してください。"
    );
    return;
  }

  try {
    // CSV生成
    const csv = generateCSV(rows);
    const filename = generateCSVFilename();

    // ダウンロード実行
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    // 成功フィードバック
    alert(`CSV出力完了！\nファイル名: ${filename}\n件数: ${rows.length}件`);
  } catch (error) {
    alert(`CSV出力エラー: ${error.message}`);
    console.error("CSV export error:", error);
  }
};

// スプレッドシートへ送信（GAS）
$("send").onclick = async () => {
  const gasUrl = $("gasUrl").value.trim();
  if (!gasUrl) {
    alert("GASのWebApp URLを設定してください");
    return;
  }
  if (rows.length === 0) {
    alert("送信するデータがありません");
    return;
  }
  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 必要に応じて credentials: "include" も検討
      body: JSON.stringify({ rows }),
    });
    const data = await res.json();
    alert(`送信結果: ${JSON.stringify(data)}`);
  } catch (e) {
    alert(`送信エラー: ${e}`);
  }
};

// 拾う/止める
$("start").onclick = () => {
  collecting = true;
  alert("収集を開始しました。ページを再読み込みしてください。");
};
$("stop").onclick = () => {
  collecting = false;
  alert(`収集を停止しました。収集件数: ${rows.length}件`);
};

// DevToolsのNetworkイベント
chrome.devtools.network.onRequestFinished.addListener((req) => {
  if (!collecting) return;

  const name = req.request?.url
    ? new URL(req.request.url).pathname.split("/").pop() || ""
    : req.request?.url || "";
  const url = req.request?.url || "";

  // 拡張子による画像判定
  try {
    const u = new URL(url);
    const pathname = u.pathname.toLowerCase();
    const ext = pathname.slice(pathname.lastIndexOf("."));

    if (!IMAGE_EXTS.has(ext)) return; // 画像以外はスキップ
  } catch {
    return; // URL解析エラーはスキップ
  }

  // 画像データを蓄積
  rows.push([name, url]);
  updateView();
});

// タブをまたいだら初期化したい場合は適宜 rows = [] をクリア
chrome.devtools.network.onNavigated.addListener(() => {
  // rows = [];
  // updateView();
});
