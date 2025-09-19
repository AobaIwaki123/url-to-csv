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

// パネル初期化ログ
console.log("Net2Sheet パネル初期化開始");
console.log("対象画像拡張子:", Array.from(IMAGE_EXTS));
console.log("初期状態 - collecting:", collecting, "rows:", rows.length);
const updateView = () => {
  $("count").textContent = String(rows.length);

  // プレビュー表示（ヘッダー付き）
  if (rows.length > 0) {
    const header = '"ファイル名","URL"';
    const dataRows = rows.map((r) =>
      r.map((v) => `"${(v ?? "").replace(/"/g, '""')}"`).join(",")
    );
    $("preview").value = [header, ...dataRows].join("\n");
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
    // CSVヘッダー（日本語）
    const header = [["ファイル名", "URL"]];
    const all = header.concat(rows);

    // CSV生成（適切なエスケープ処理）
    const csv = all
      .map((r) => r.map((v) => `"${(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // タイムスタンプ付きファイル名生成
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, "_");
    const filename = `network_images_${timestamp}.csv`;

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
  console.log("収集開始 - collecting:", collecting);
  alert("収集を開始しました。ページを再読み込みしてください。");
};
$("stop").onclick = () => {
  collecting = false;
  console.log("収集停止 - collecting:", collecting);
  alert(`収集を停止しました。収集件数: ${rows.length}件`);
};

// DevToolsのNetworkイベント
chrome.devtools.network.onRequestFinished.addListener((req) => {
  console.log("ネットワークリクエスト検出:", req.request?.url);

  if (!collecting) {
    console.log("収集停止中のため無視:", req.request?.url);
    return;
  }

  const name = req.request?.url
    ? new URL(req.request.url).pathname.split("/").pop() || ""
    : req.request?.url || "";
  const url = req.request?.url || "";

  console.log("リクエスト処理中:", { name, url });

  // レスポンスが画像MIMEなら確実だが、ここでは拡張子で手早くフィルタ
  try {
    const u = new URL(url);
    const pathname = u.pathname.toLowerCase();
    const ext = pathname.slice(pathname.lastIndexOf("."));
    console.log("拡張子チェック:", {
      pathname,
      ext,
      isImage: IMAGE_EXTS.has(ext),
    });

    if (!IMAGE_EXTS.has(ext)) {
      console.log("画像ではないためスキップ:", ext);
      return; // 拡張子判定
    }
  } catch (error) {
    console.log("URL解析エラー:", error, url);
    return;
  }

  // ここで name, url を蓄積
  rows.push([name, url]);
  console.log("画像を収集しました:", { name, url, totalCount: rows.length });
  updateView();
});

// タブをまたいだら初期化したい場合は適宜 rows = [] をクリア
chrome.devtools.network.onNavigated.addListener(() => {
  // rows = [];
  // updateView();
});
