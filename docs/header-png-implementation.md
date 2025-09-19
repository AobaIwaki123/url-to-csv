# ヘッダーPNG保存機能の実装方法

このドキュメントでは、URL to CSV と CSV Image Checker ツールで使用されている **ヘッダーPNG保存機能** の実装方法について詳しく説明します。

## 📋 目次

1. [概要](#概要)
2. [基本実装](#基本実装)
3. [設定とカスタマイズ](#設定とカスタマイズ)
4. [ツール固有の実装](#ツール固有の実装)
5. [トラブルシューティング](#トラブルシューティング)
6. [応用例](#応用例)

## 🎯 概要

### 機能の目的
- Webツールのヘッダータイトルを高品質なPNG画像として保存
- ソーシャルメディアやドキュメントでの使用に適したプロフェッショナルなヘッダー画像生成
- 統一されたブランディングデザインでのツール識別

### 生成される画像の特徴
- **サイズ**: 1200 x 300 ピクセル（高解像度）
- **背景**: グラデーション（インディゴ → パープル）
- **角丸**: 20px の角丸矩形
- **テキスト**: ツール名 + サブタイトル（日本語対応）
- **フォーマット**: PNG（透明度サポート）

## 🔧 基本実装

### 1. header-utils.js のインクルード

まず、共有ユーティリティファイルをHTMLファイルに読み込みます：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Your Tool Name</title>
</head>
<body>
    <!-- ツールのUI要素 -->
    
    <!-- header-utils.js を読み込み -->
    <script src="header-utils.js"></script>
    
    <!-- ツール固有のスクリプト -->
    <script>
        // 実装コードをここに記述
    </script>
</body>
</html>
```

### 2. ボタンの配置

ヘッダーPNG保存ボタンを作成し、指定したコンテナに配置：

```javascript
// DOMContentLoaded イベントで初期化
document.addEventListener('DOMContentLoaded', function() {
    // ツール名とサブタイトルを定義
    const toolName = "🔗 Your Tool Name";
    const subtitle = "ツールの説明文をここに記述";
    
    // ボタンを作成（コンテナIDを指定）
    const button = createHeaderPngButton(toolName, subtitle, "header-container");
    
    console.log("ヘッダーPNGボタンが作成されました");
});
```

### 3. HTMLコンテナの準備

ボタンを配置するためのHTMLコンテナを用意：

```html
<div class="tool-header">
    <h1>🔗 Your Tool Name</h1>
    <p>ツールの説明文</p>
    
    <!-- ヘッダーPNGボタンが挿入されるコンテナ -->
    <div id="header-container"></div>
</div>
```

## ⚙️ 設定とカスタマイズ

### 基本設定の変更

`header-utils.js` の設定を変更することで、生成される画像をカスタマイズできます：

```javascript
// PNG_CONFIG オブジェクトの設定項目
const PNG_CONFIG = {
    width: 1200,              // 画像の幅（ピクセル）
    height: 300,              // 画像の高さ（ピクセル）
    cornerRadius: 20,         // 角丸の半径（ピクセル）
    gradientStart: "#4f46e5", // グラデーション開始色（インディゴ）
    gradientEnd: "#7c3aed",   // グラデーション終了色（パープル）
    mainFontSize: "72px",     // メインタイトルのフォントサイズ
    subFontSize: "32px",      // サブタイトルのフォントサイズ
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};
```

### カスタムカラーテーマ

異なるツールで異なるカラーテーマを使用する例：

```javascript
// ツール固有のカラー設定
const CUSTOM_THEMES = {
    urlToCsv: {
        gradientStart: "#059669", // エメラルドグリーン
        gradientEnd: "#047857"
    },
    csvChecker: {
        gradientStart: "#dc2626", // レッド
        gradientEnd: "#b91c1c"
    }
};

// カスタムテーマでPNG生成
function exportCustomHeaderPng(toolName, subtitle, theme) {
    // 一時的に設定を変更
    const originalStart = PNG_CONFIG.gradientStart;
    const originalEnd = PNG_CONFIG.gradientEnd;
    
    PNG_CONFIG.gradientStart = theme.gradientStart;
    PNG_CONFIG.gradientEnd = theme.gradientEnd;
    
    // PNG生成実行
    exportHeaderAsPng(toolName, subtitle);
    
    // 設定を元に戻す
    PNG_CONFIG.gradientStart = originalStart;
    PNG_CONFIG.gradientEnd = originalEnd;
}
```

## 🛠️ ツール固有の実装

### URL to CSV での実装例

```javascript
// url-to-csv.html での実装
document.addEventListener('DOMContentLoaded', function() {
    // 既存のツール固有の設定を使用
    const toolConfig = HeaderPngUtils.urlToCsv;
    
    // ボタンを作成
    const button = HeaderPngUtils.createButton(
        toolConfig.toolName,
        toolConfig.subtitle,
        "controls" // 既存のコントロールエリアに配置
    );
    
    // 成功メッセージ用のカスタムコールバック
    const showSuccess = (message) => {
        // 既存の成功表示システムを使用
        if (typeof showMessage === 'function') {
            showMessage(message, 'success');
        } else {
            alert(message);
        }
    };
    
    // ボタンクリック時の処理をカスタマイズ
    button.addEventListener('click', () => {
        toolConfig.export(showSuccess);
    });
});
```

### CSV Image Checker での実装例

```javascript
// csv-checker.html での実装
document.addEventListener('DOMContentLoaded', function() {
    // 既存のツール固有の設定を使用
    const toolConfig = HeaderPngUtils.csvChecker;
    
    // ヘッダーエリアにボタンを追加
    const headerArea = document.querySelector('.header-controls');
    if (headerArea) {
        const button = HeaderPngUtils.createButton(
            toolConfig.toolName,
            toolConfig.subtitle,
            headerArea.id || 'header-controls'
        );
        
        // CSV Checker 固有のスタイル調整
        button.style.marginLeft = "1rem";
    }
});
```

### 新しいツールでの実装例

```javascript
// 新しいツールでの完全な実装例
class NewTool {
    constructor() {
        this.toolName = "📊 New Analysis Tool";
        this.subtitle = "データ分析とレポート生成ツール";
        
        this.initializeHeaderPng();
    }
    
    initializeHeaderPng() {
        // ヘッダーPNGボタンを作成
        const button = createHeaderPngButton(
            this.toolName,
            this.subtitle,
            "tool-header"
        );
        
        // カスタム成功メッセージ
        const originalClick = button.onclick;
        button.onclick = () => {
            exportHeaderAsPng(
                this.toolName,
                this.subtitle,
                this.showSuccessMessage.bind(this)
            );
        };
    }
    
    showSuccessMessage(message) {
        // ツール固有の成功メッセージ表示
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒後に自動削除
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// ツールの初期化
document.addEventListener('DOMContentLoaded', () => {
    new NewTool();
});
```

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. ボタンが表示されない

**原因**: コンテナIDが存在しない、またはDOMが読み込まれる前に実行している

**解決方法**:
```javascript
// DOMContentLoaded イベントを使用
document.addEventListener('DOMContentLoaded', function() {
    // コンテナの存在確認
    const container = document.getElementById('your-container-id');
    if (!container) {
        console.error('指定されたコンテナが見つかりません');
        return;
    }
    
    // ボタン作成処理
    createHeaderPngButton(toolName, subtitle, 'your-container-id');
});
```

#### 2. ダウンロードが開始されない

**原因**: ブラウザのセキュリティ設定、またはCanvas操作の失敗

**解決方法**:
```javascript
// エラーハンドリングを追加
function safeExportHeaderPng(toolName, subtitle) {
    try {
        exportHeaderAsPng(toolName, subtitle, (message) => {
            console.log('成功:', message);
        });
    } catch (error) {
        console.error('PNG生成エラー:', error);
        alert('PNG生成中にエラーが発生しました: ' + error.message);
    }
}
```

#### 3. 日本語フォントが表示されない

**原因**: システムフォントの設定問題

**解決方法**:
```javascript
// フォントフォールバックを強化
const ENHANCED_FONT_FAMILY = `
    "Hiragino Kaku Gothic ProN", 
    "Hiragino Sans", 
    "Yu Gothic", 
    "Meiryo", 
    -apple-system, 
    BlinkMacSystemFont, 
    "Segoe UI", 
    sans-serif
`.replace(/\s+/g, ' ').trim();

// PNG_CONFIG の fontFamily を更新
PNG_CONFIG.fontFamily = ENHANCED_FONT_FAMILY;
```

## 🚀 応用例

### 1. 複数サイズでの生成

```javascript
const SIZES = {
    thumbnail: { width: 400, height: 100 },
    standard: { width: 1200, height: 300 },
    banner: { width: 1920, height: 480 }
};

function exportMultipleSizes(toolName, subtitle) {
    Object.entries(SIZES).forEach(([sizeName, dimensions]) => {
        // 設定を一時変更
        const originalWidth = PNG_CONFIG.width;
        const originalHeight = PNG_CONFIG.height;
        
        PNG_CONFIG.width = dimensions.width;
        PNG_CONFIG.height = dimensions.height;
        
        // ファイル名にサイズを含める
        const originalExport = exportHeaderAsPng;
        exportHeaderAsPng = function(name, sub, callback) {
            // カスタムファイル名生成
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
            const filename = `${name.toLowerCase().replace(/\s+/g, "-")}-${sizeName}-${timestamp}.png`;
            
            // PNG生成処理（カスタムファイル名で）
            originalExport.call(this, name, sub, callback);
        };
        
        // 実行
        exportHeaderAsPng(toolName, subtitle);
        
        // 設定を復元
        PNG_CONFIG.width = originalWidth;
        PNG_CONFIG.height = originalHeight;
        exportHeaderAsPng = originalExport;
    });
}
```

### 2. 動的なコンテンツ反映

```javascript
function exportDynamicHeader() {
    // 現在の日時を取得
    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP');
    
    // 動的なサブタイトル生成
    const dynamicSubtitle = `${dateStr} に生成されたレポート`;
    
    // 処理件数やその他の動的情報を含める
    const processedCount = document.getElementById('count')?.textContent || '0';
    const detailedSubtitle = `${processedCount}件の画像URL を処理済み - ${dateStr}`;
    
    exportHeaderAsPng("📊 Dynamic Report", detailedSubtitle);
}
```

### 3. テーマ切り替え機能

```javascript
const THEMES = {
    default: {
        gradientStart: "#4f46e5",
        gradientEnd: "#7c3aed",
        name: "デフォルト"
    },
    ocean: {
        gradientStart: "#0ea5e9",
        gradientEnd: "#0284c7",
        name: "オーシャン"
    },
    sunset: {
        gradientStart: "#f59e0b",
        gradientEnd: "#dc2626",
        name: "サンセット"
    },
    forest: {
        gradientStart: "#059669",
        gradientEnd: "#047857",
        name: "フォレスト"
    }
};

function createThemeSelector() {
    const selector = document.createElement('select');
    selector.id = 'theme-selector';
    
    Object.entries(THEMES).forEach(([key, theme]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.name;
        selector.appendChild(option);
    });
    
    return selector;
}

function exportWithSelectedTheme(toolName, subtitle) {
    const selector = document.getElementById('theme-selector');
    const selectedTheme = THEMES[selector.value] || THEMES.default;
    
    // テーマを適用してPNG生成
    const originalStart = PNG_CONFIG.gradientStart;
    const originalEnd = PNG_CONFIG.gradientEnd;
    
    PNG_CONFIG.gradientStart = selectedTheme.gradientStart;
    PNG_CONFIG.gradientEnd = selectedTheme.gradientEnd;
    
    exportHeaderAsPng(toolName, subtitle, (message) => {
        console.log(`${selectedTheme.name}テーマで保存完了: ${message}`);
    });
    
    // 設定を復元
    PNG_CONFIG.gradientStart = originalStart;
    PNG_CONFIG.gradientEnd = originalEnd;
}
```

## 📚 まとめ

このドキュメントで説明した実装方法を使用することで、以下が可能になります：

1. **簡単な統合**: `header-utils.js` を読み込むだけで基本機能が利用可能
2. **柔軟なカスタマイズ**: 設定オブジェクトの変更で外観を調整
3. **ツール固有の対応**: 既存のUIシステムとの統合
4. **拡張性**: 新機能やテーマの追加が容易

### 次のステップ

- 既存のツールへの実装
- カスタムテーマの作成
- ユーザー設定の保存機能の追加
- 複数フォーマット対応（SVG、WebP等）

詳細な質問や追加の実装サポートが必要な場合は、プロジェクトのREADMEまたは関連ドキュメントを参照してください。
