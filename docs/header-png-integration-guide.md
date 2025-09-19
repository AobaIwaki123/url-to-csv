# ヘッダーPNG機能の統合ガイド

このガイドでは、既存のツールおよび新規ツールにヘッダーPNG保存機能を統合する具体的な手順について説明します。

## 📋 目次

1. [既存ツールへの統合](#既存ツールへの統合)
2. [新規ツールでの実装](#新規ツールでの実装)
3. [統合チェックリスト](#統合チェックリスト)
4. [ベストプラクティス](#ベストプラクティス)

## 🔧 既存ツールへの統合

### URL to CSV (url-to-csv.html) への統合

#### ステップ1: script タグの追加

```html
<!-- 既存の </body> タグの直前に追加 -->
<script src="header-utils.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーPNG機能を初期化
    initializeHeaderPng();
});

function initializeHeaderPng() {
    // URL to CSV 用の設定を使用
    const config = HeaderPngUtils.urlToCsv;
    
    // ボタンを controls セクションに追加
    const controlsDiv = document.querySelector('.controls');
    if (controlsDiv) {
        // 新しいコンテナを作成
        const headerPngContainer = document.createElement('div');
        headerPngContainer.id = 'header-png-container';
        headerPngContainer.style.marginTop = '1rem';
        controlsDiv.appendChild(headerPngContainer);
        
        // ボタンを作成
        const button = HeaderPngUtils.createButton(
            config.toolName,
            config.subtitle,
            'header-png-container'
        );
        
        // 成功メッセージの統合
        const originalClick = button.onclick;
        button.onclick = () => {
            config.export((message) => {
                // 既存のメッセージ表示機能を使用
                showMessage(message, 'success');
            });
        };
    }
}

// 既存のメッセージ表示機能と統合
function showMessage(text, type = 'info') {
    // 既存のメッセージ表示ロジックを使用
    // または新しい通知システムを実装
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 6px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
</script>

<style>
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
</style>
```

#### ステップ2: CSSスタイリングの調整

```css
/* 既存のCSSファイルまたは<style>タグに追加 */
#header-png-container {
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
}

#exportHeaderBtn {
    width: 100%;
    margin-top: 0.5rem;
}

#exportHeaderBtn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### CSV Image Checker (csv-checker.html) への統合

#### ステップ1: HTML構造の確認と修正

```html
<!-- 既存のヘッダーセクションを確認 -->
<div class="header-section">
    <h1>📋 CSV Image Checker</h1>
    <p>Net2Sheet画像URLの確認・編集ツール</p>
    
    <!-- ヘッダーPNGボタン用のコンテナを追加 -->
    <div id="header-controls"></div>
</div>
```

#### ステップ2: 統合スクリプトの追加

```javascript
// csv-checker.html の既存スクリプトセクションに追加
document.addEventListener('DOMContentLoaded', function() {
    // 既存の初期化処理...
    
    // ヘッダーPNG機能の初期化
    initializeCsvCheckerHeaderPng();
});

function initializeCsvCheckerHeaderPng() {
    const config = HeaderPngUtils.csvChecker;
    
    // ボタンを作成
    const button = HeaderPngUtils.createButton(
        config.toolName,
        config.subtitle,
        'header-controls'
    );
    
    // CSV Checker のUIスタイルに合わせてボタンをカスタマイズ
    button.style.cssText += `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;
    
    // 成功メッセージの表示
    const originalClick = button.onclick;
    button.onclick = () => {
        config.export((message) => {
            showCsvCheckerMessage(message);
        });
    };
}

function showCsvCheckerMessage(message) {
    // CSV Checker 用のカスタム通知
    const notification = document.createElement('div');
    notification.className = 'csv-checker-notification';
    notification.innerHTML = `
        <div class="notification-icon">✅</div>
        <div class="notification-text">${message}</div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        border: 2px solid #10b981;
        border-radius: 8px;
        padding: 12px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
```

#### ステップ3: アニメーション用CSS

```css
@keyframes bounceIn {
    0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.05); }
    70% { transform: translateX(-50%) scale(0.9); }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

@keyframes fadeOut {
    to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
}

.csv-checker-notification {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    color: #1f2937;
}

.notification-icon {
    font-size: 18px;
}
```

## 🆕 新規ツールでの実装

### 基本テンプレート

新規ツールを作成する際の基本テンプレート：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新しいツール</title>
    <style>
        /* ツール固有のスタイル */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #1f2937;
            margin: 0 0 10px 0;
        }
        
        .header p {
            color: #6b7280;
            margin: 0;
        }
        
        #header-controls {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🆕 新しいツール</h1>
            <p>新機能の説明文をここに記述</p>
            <div id="header-controls"></div>
        </div>
        
        <!-- ツールの主要コンテンツ -->
        <div class="main-content">
            <!-- ツール固有のUI要素をここに配置 -->
        </div>
    </div>
    
    <!-- ヘッダーPNG機能の統合 -->
    <script src="header-utils.js"></script>
    <script>
        // ツールクラスの定義
        class NewTool {
            constructor() {
                this.toolName = "🆕 新しいツール";
                this.subtitle = "新機能の説明文をここに記述";
                
                this.initialize();
            }
            
            initialize() {
                // ツール固有の初期化処理
                this.setupUI();
                this.initializeHeaderPng();
            }
            
            setupUI() {
                // ツール固有のUI初期化
                console.log("新しいツールが初期化されました");
            }
            
            initializeHeaderPng() {
                // ヘッダーPNG機能の初期化
                const button = createHeaderPngButton(
                    this.toolName,
                    this.subtitle,
                    'header-controls'
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
                
                // ボタンスタイルのカスタマイズ
                this.customizeHeaderButton(button);
            }
            
            customizeHeaderButton(button) {
                // ツール固有のボタンスタイル
                button.style.cssText += `
                    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                    border: none;
                    color: white;
                    font-weight: bold;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                `;
            }
            
            showSuccessMessage(message) {
                // カスタム成功メッセージ表示
                this.createNotification(message, 'success');
            }
            
            createNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
                        <span class="notification-message">${message}</span>
                    </div>
                `;
                
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${type === 'success' ? '#10b981' : '#3b82f6'};
                    color: white;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 350px;
                `;
                
                document.body.appendChild(notification);
                
                // 自動削除
                setTimeout(() => {
                    notification.style.animation = 'slideOutRight 0.3s ease forwards';
                    setTimeout(() => notification.remove(), 300);
                }, 4000);
            }
        }
        
        // アニメーション定義
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notification-icon {
                font-size: 16px;
            }
            
            .notification-message {
                font-size: 14px;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
        
        // ツールの初期化
        document.addEventListener('DOMContentLoaded', () => {
            new NewTool();
        });
    </script>
</body>
</html>
```

## ✅ 統合チェックリスト

### 実装前の確認事項

- [ ] `header-utils.js` が正しくプロジェクトに配置されている
- [ ] ツール名とサブタイトルが決定されている
- [ ] ボタンを配置するコンテナ要素が存在する
- [ ] 既存のUIスタイルとの統合方法を検討済み

### 実装中の確認事項

- [ ] `DOMContentLoaded` イベントで初期化している
- [ ] エラーハンドリングを実装している
- [ ] 成功メッセージの表示方法を定義している
- [ ] ボタンのスタイルが既存UIと統合されている

### 実装後のテスト項目

- [ ] ボタンが正しく表示される
- [ ] クリック時にPNGダウンロードが開始される
- [ ] 生成される画像の内容が正しい
- [ ] ファイル名が適切に設定される
- [ ] 成功メッセージが表示される
- [ ] 複数回実行しても正常に動作する
- [ ] 異なるブラウザで動作確認

### ブラウザ互換性テスト

- [ ] Chrome (最新版)
- [ ] Firefox (最新版)  
- [ ] Safari (最新版)
- [ ] Edge (最新版)

## 🎯 ベストプラクティス

### 1. エラーハンドリング

```javascript
function safeInitializeHeaderPng() {
    try {
        // header-utils.js の読み込み確認
        if (typeof createHeaderPngButton === 'undefined') {
            console.error('header-utils.js が読み込まれていません');
            return;
        }
        
        // DOM要素の存在確認
        const container = document.getElementById('header-controls');
        if (!container) {
            console.error('ヘッダーコントロールコンテナが見つかりません');
            return;
        }
        
        // ヘッダーPNG機能を初期化
        initializeHeaderPng();
        
    } catch (error) {
        console.error('ヘッダーPNG機能の初期化に失敗:', error);
        
        // フォールバック: 簡易ボタンを作成
        createFallbackButton();
    }
}

function createFallbackButton() {
    const button = document.createElement('button');
    button.textContent = '📸 ヘッダーをPNGで保存（簡易版）';
    button.onclick = () => {
        alert('ヘッダーPNG機能の初期化に失敗しました。ページを再読み込みしてください。');
    };
    
    const container = document.getElementById('header-controls');
    if (container) {
        container.appendChild(button);
    }
}
```

### 2. 設定の外部化

```javascript
// config.js として分離することを推奨
const TOOL_CONFIG = {
    newTool: {
        toolName: "🆕 新しいツール",
        subtitle: "新機能の説明文",
        theme: {
            gradientStart: "#ff6b6b",
            gradientEnd: "#ee5a24"
        },
        notification: {
            duration: 4000,
            position: 'top-right'
        }
    }
};

// 使用例
function initializeWithConfig() {
    const config = TOOL_CONFIG.newTool;
    
    // テーマを適用
    if (config.theme) {
        PNG_CONFIG.gradientStart = config.theme.gradientStart;
        PNG_CONFIG.gradientEnd = config.theme.gradientEnd;
    }
    
    // ヘッダーPNG機能を初期化
    const button = createHeaderPngButton(
        config.toolName,
        config.subtitle,
        'header-controls'
    );
}
```

### 3. 再利用可能なコンポーネント化

```javascript
class HeaderPngComponent {
    constructor(options) {
        this.options = {
            toolName: "デフォルトツール",
            subtitle: "説明文",
            containerId: "header-controls",
            theme: null,
            onSuccess: null,
            onError: null,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.createButton();
    }
    
    applyTheme() {
        if (this.options.theme) {
            this.originalTheme = {
                start: PNG_CONFIG.gradientStart,
                end: PNG_CONFIG.gradientEnd
            };
            
            PNG_CONFIG.gradientStart = this.options.theme.gradientStart;
            PNG_CONFIG.gradientEnd = this.options.theme.gradientEnd;
        }
    }
    
    createButton() {
        try {
            const button = createHeaderPngButton(
                this.options.toolName,
                this.options.subtitle,
                this.options.containerId
            );
            
            // カスタムイベントハンドラー
            button.onclick = () => this.exportPng();
            
        } catch (error) {
            if (this.options.onError) {
                this.options.onError(error);
            }
        }
    }
    
    exportPng() {
        const successCallback = (message) => {
            if (this.options.onSuccess) {
                this.options.onSuccess(message);
            }
            
            // テーマを復元
            if (this.originalTheme) {
                PNG_CONFIG.gradientStart = this.originalTheme.start;
                PNG_CONFIG.gradientEnd = this.originalTheme.end;
            }
        };
        
        exportHeaderAsPng(
            this.options.toolName,
            this.options.subtitle,
            successCallback
        );
    }
    
    destroy() {
        const button = document.getElementById('exportHeaderBtn');
        if (button) {
            button.remove();
        }
        
        // テーマを復元
        if (this.originalTheme) {
            PNG_CONFIG.gradientStart = this.originalTheme.start;
            PNG_CONFIG.gradientEnd = this.originalTheme.end;
        }
    }
}

// 使用例
const headerPng = new HeaderPngComponent({
    toolName: "🚀 Advanced Tool",
    subtitle: "高度な機能を持つツール",
    theme: {
        gradientStart: "#667eea",
        gradientEnd: "#764ba2"
    },
    onSuccess: (message) => {
        console.log('成功:', message);
        showCustomNotification(message, 'success');
    },
    onError: (error) => {
        console.error('エラー:', error);
        showCustomNotification('PNG生成に失敗しました', 'error');
    }
});
```

この統合ガイドに従うことで、既存ツールへの機能追加と新規ツールでの実装を効率的に行うことができます。
