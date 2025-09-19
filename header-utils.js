/**
 * Net2Sheet ヘッダーPNG生成ユーティリティ
 * URL to CSV と CSV Image Checker で共通利用
 *
 * @version 1.0.0
 * @author Net2Sheet Team
 */

/**
 * ヘッダーボタンのスタイル設定
 */
const HEADER_BUTTON_STYLE = {
  marginTop: "1rem",
  padding: "8px 16px",
  background: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "background 0.3s ease",
};

/**
 * PNG生成の設定
 */
const PNG_CONFIG = {
  width: 1200,
  height: 300,
  cornerRadius: 20,
  gradientStart: "#4f46e5",
  gradientEnd: "#7c3aed",
  mainFontSize: "72px",
  subFontSize: "32px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
};

/**
 * ヘッダーPNG生成ボタンを作成する
 * @param {string} toolName - ツール名（"URL to CSV" または "CSV Image Checker"）
 * @param {string} subtitle - サブタイトル
 * @param {string} containerId - ボタンを挿入するコンテナのID
 * @returns {HTMLButtonElement} 作成されたボタン要素
 */
function createHeaderPngButton(toolName, subtitle, containerId) {
  const button = document.createElement("button");
  button.id = "exportHeaderBtn";
  button.textContent = "📸 ヘッダーをPNGで保存";

  // スタイルを適用
  Object.assign(button.style, HEADER_BUTTON_STYLE);

  // ホバーエフェクト
  button.addEventListener("mouseover", () => {
    button.style.background = "rgba(255, 255, 255, 0.3)";
  });

  button.addEventListener("mouseout", () => {
    button.style.background = "rgba(255, 255, 255, 0.2)";
  });

  // クリックイベント
  button.addEventListener("click", () => {
    exportHeaderAsPng(toolName, subtitle);
  });

  // 指定されたコンテナに追加
  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(button);
  }

  return button;
}

/**
 * 角丸矩形を描画するヘルパー関数
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D コンテキスト
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @param {number} width - 幅
 * @param {number} height - 高さ
 * @param {number} radius - 角丸の半径
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * ヘッダーをPNG画像として出力
 * @param {string} toolName - ツール名
 * @param {string} subtitle - サブタイトル
 * @param {function} showSuccessCallback - 成功メッセージ表示用コールバック関数
 */
function exportHeaderAsPng(toolName, subtitle, showSuccessCallback) {
  // Canvas要素を作成
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // キャンバスサイズ設定（高解像度）
  canvas.width = PNG_CONFIG.width;
  canvas.height = PNG_CONFIG.height;

  // グラデーション背景を作成
  const gradient = ctx.createLinearGradient(
    0,
    0,
    PNG_CONFIG.width,
    PNG_CONFIG.height
  );
  gradient.addColorStop(0, PNG_CONFIG.gradientStart);
  gradient.addColorStop(1, PNG_CONFIG.gradientEnd);

  // 背景を描画（角丸矩形）
  ctx.fillStyle = gradient;
  drawRoundedRect(
    ctx,
    0,
    0,
    PNG_CONFIG.width,
    PNG_CONFIG.height,
    PNG_CONFIG.cornerRadius
  );
  ctx.fill();

  // テキストスタイル設定
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // メインタイトル
  ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
  ctx.fillText(toolName, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - 30);

  // サブタイトル
  ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
  ctx.globalAlpha = 0.9;
  ctx.fillText(subtitle, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + 40);

  // ファイル名生成
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `${toolName
    .toLowerCase()
    .replace(/\s+/g, "-")}-header-${timestamp}.png`;

  // PNGとしてダウンロード
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 成功メッセージ表示
    if (showSuccessCallback && typeof showSuccessCallback === "function") {
      showSuccessCallback("ヘッダー画像をPNGとして保存しました。");
    } else {
      // フォールバック: アラート表示
      alert("ヘッダー画像をPNGとして保存しました。");
    }
  }, "image/png");
}

/**
 * ツール固有の設定でヘッダーPNG生成を実行
 */
const HeaderPngUtils = {
  /**
   * URL to CSV 用の設定
   */
  urlToCsv: {
    toolName: "🔗 URL to CSV",
    subtitle: "WebページのURL から画像一覧を抽出してCSVを生成",
    export: function (showSuccessCallback) {
      exportHeaderAsPng(this.toolName, this.subtitle, showSuccessCallback);
    },
  },

  /**
   * CSV Image Checker 用の設定
   */
  csvChecker: {
    toolName: "📋 CSV Image Checker",
    subtitle: "Net2Sheet画像URLの確認・編集ツール",
    export: function (showSuccessCallback) {
      exportHeaderAsPng(this.toolName, this.subtitle, showSuccessCallback);
    },
  },

  /**
   * 汎用的なヘッダーPNG生成
   */
  createButton: createHeaderPngButton,
  exportPng: exportHeaderAsPng,
  drawRoundedRect: drawRoundedRect,
};

// グローバルに公開
if (typeof window !== "undefined") {
  window.HeaderPngUtils = HeaderPngUtils;
}
