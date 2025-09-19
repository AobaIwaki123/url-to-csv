# ヘッダーPNG機能 実装例集

このドキュメントでは、ヘッダーPNG保存機能の実用的な実装例を豊富に提供します。コピー&ペーストで使える完全なコード例から、高度なカスタマイズまで幅広くカバーしています。

## 📋 目次

1. [基本的な実装例](#基本的な実装例)
2. [実際のツールでの応用例](#実際のツールでの応用例)
3. [高度なカスタマイズ例](#高度なカスタマイズ例)
4. [UI統合パターン](#ui統合パターン)
5. [エラーハンドリング例](#エラーハンドリング例)

## 🚀 基本的な実装例

### 例1: 最小限の実装

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>基本的なヘッダーPNG実装</title>
</head>
<body>
    <div id="header">
        <h1>📊 データ分析ツール</h1>
        <p>効率的なデータ処理ソリューション</p>
        <div id="png-controls"></div>
    </div>
    
    <script src="header-utils.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 最小限の設定でボタンを作成
            createHeaderPngButton(
                "📊 データ分析ツール",
                "効率的なデータ処理ソリューション",
                "png-controls"
            );
        });
    </script>
</body>
</html>
```

### 例2: 成功メッセージ付き実装

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>成功メッセージ付き実装</title>
    <style>
        .success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    </style>
</head>
<body>
    <div id="app">
        <header>
            <h1>🔧 設定管理ツール</h1>
            <p>システム設定の一元管理</p>
            <div id="header-controls"></div>
        </header>
    </div>
    
    <script src="header-utils.js"></script>
    <script>
        function showSuccessMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = message;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const button = createHeaderPngButton(
                "🔧 設定管理ツール",
                "システム設定の一元管理",
                "header-controls"
            );
            
            // カスタム成功メッセージ
            button.onclick = () => {
                exportHeaderAsPng(
                    "🔧 設定管理ツール",
                    "システム設定の一元管理",
                    showSuccessMessage
                );
            };
        });
    </script>
</body>
</html>
```

### 例3: 複数テーマ対応実装

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>テーマ選択付き実装</title>
    <style>
        .theme-controls {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .theme-selector {
            margin-right: 10px;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .export-button {
            padding: 8px 16px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .export-button:hover {
            background: #4338ca;
        }
    </style>
</head>
<body>
    <div id="app">
        <header>
            <h1>🎨 デザインツール</h1>
            <p>クリエイティブなデザイン作成</p>
        </header>
        
        <div class="theme-controls">
            <label for="theme-select">テーマを選択:</label>
            <select id="theme-select" class="theme-selector">
                <option value="default">デフォルト</option>
                <option value="ocean">オーシャン</option>
                <option value="sunset">サンセット</option>
                <option value="forest">フォレスト</option>
                <option value="rose">ローズ</option>
            </select>
            <button id="export-png" class="export-button">📸 ヘッダーをPNGで保存</button>
        </div>
    </div>
    
    <script src="header-utils.js"></script>
    <script>
        // テーマ定義
        const THEMES = {
            default: { start: "#4f46e5", end: "#7c3aed", name: "デフォルト" },
            ocean: { start: "#0ea5e9", end: "#0284c7", name: "オーシャン" },
            sunset: { start: "#f59e0b", end: "#dc2626", name: "サンセット" },
            forest: { start: "#059669", end: "#047857", name: "フォレスト" },
            rose: { start: "#ec4899", end: "#be185d", name: "ローズ" }
        };
        
        function exportWithSelectedTheme() {
            const themeSelect = document.getElementById('theme-select');
            const selectedTheme = THEMES[themeSelect.value];
            
            // 元の設定を保存
            const originalStart = PNG_CONFIG.gradientStart;
            const originalEnd = PNG_CONFIG.gradientEnd;
            
            // 選択されたテーマを適用
            PNG_CONFIG.gradientStart = selectedTheme.start;
            PNG_CONFIG.gradientEnd = selectedTheme.end;
            
            exportHeaderAsPng(
                "🎨 デザインツール",
                "クリエイティブなデザイン作成",
                (message) => {
                    alert(`${selectedTheme.name}テーマで保存完了: ${message}`);
                    
                    // 設定を復元
                    PNG_CONFIG.gradientStart = originalStart;
                    PNG_CONFIG.gradientEnd = originalEnd;
                }
            );
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('export-png').onclick = exportWithSelectedTheme;
        });
    </script>
</body>
</html>
```

## 🛠️ 実際のツールでの応用例

### 例4: URL to CSV への統合

```javascript
// url-to-csv.html への完全統合例
document.addEventListener('DOMContentLoaded', function() {
    // 既存のUI要素を確認
    const controlsSection = document.querySelector('.controls');
    if (!controlsSection) {
        console.error('コントロールセクションが見つかりません');
        return;
    }
    
    // ヘッダーPNG用のセクションを作成
    const headerPngSection = document.createElement('div');
    headerPngSection.id = 'header-png-section';
    headerPngSection.style.cssText = `
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // セクションタイトル
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = '📸 ヘッダー画像の生成';
    sectionTitle.style.cssText = `
        color: white;
        margin: 0 0 10px 0;
        font-size: 16px;
    `;
    
    // 説明文
    const description = document.createElement('p');
    description.textContent = 'ツールのヘッダーをPNG画像として保存できます';
    description.style.cssText = `
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 15px 0;
        font-size: 14px;
    `;
    
    // ボタンコンテナ
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'png-button-container';
    
    headerPngSection.appendChild(sectionTitle);
    headerPngSection.appendChild(description);
    headerPngSection.appendChild(buttonContainer);
    controlsSection.appendChild(headerPngSection);
    
    // ヘッダーPNGボタンを作成
    const config = HeaderPngUtils.urlToCsv;
    const button = HeaderPngUtils.createButton(
        config.toolName,
        config.subtitle,
        'png-button-container'
    );
    
    // URL to CSV のスタイルに合わせてカスタマイズ
    button.style.cssText += `
        width: 100%;
        margin-top: 5px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        transition: all 0.3s ease;
    `;
    
    // ホバーエフェクト
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });
    
    // 成功メッセージの統合
    button.onclick = () => {
        // 収集された画像数を取得
        const countElement = document.getElementById('count');
        const imageCount = countElement ? countElement.textContent : '0';
        
        // 動的なサブタイトル生成
        const dynamicSubtitle = `${imageCount}件の画像URLを処理済み - ${new Date().toLocaleDateString('ja-JP')}`;
        
        exportHeaderAsPng(
            config.toolName,
            dynamicSubtitle,
            (message) => {
                // 既存の成功表示機能がある場合は使用
                if (typeof showMessage === 'function') {
                    showMessage(message, 'success');
                } else {
                    // フォールバック表示
                    const notification = createNotification(message, 'success');
                    document.body.appendChild(notification);
                }
            }
        );
    };
});

// 通知作成ヘルパー関数
function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInFromRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span style="font-size: 14px;">${message}</span>
        </div>
    `;
    
    // 自動削除
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    return notification;
}

// CSS アニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutToRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
```

### 例5: CSV Image Checker への統合

```javascript
// csv-checker.html への完全統合例
document.addEventListener('DOMContentLoaded', function() {
    initializeCsvCheckerHeaderPng();
});

function initializeCsvCheckerHeaderPng() {
    // CSV Checker のヘッダーセクションを取得
    const headerSection = document.querySelector('.header') || document.querySelector('header');
    
    if (!headerSection) {
        console.error('ヘッダーセクションが見つかりません');
        return;
    }
    
    // ヘッダーPNG用のコントロールパネルを作成
    const controlPanel = document.createElement('div');
    controlPanel.id = 'header-png-controls';
    controlPanel.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // パネルのHTML構造
    controlPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: white; font-size: 16px;">📸 ヘッダー画像生成</h4>
            <span style="color: rgba(255, 255, 255, 0.7); font-size: 12px;">高品質PNG出力</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <select id="csv-theme-selector" style="padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px;">
                <option value="default">標準テーマ</option>
                <option value="professional">プロフェッショナル</option>
                <option value="vibrant">ビビッド</option>
                <option value="minimal">ミニマル</option>
            </select>
            <div id="png-button-container" style="flex: 1;"></div>
        </div>
    `;
    
    headerSection.appendChild(controlPanel);
    
    // テーマ設定
    const themes = {
        default: { start: "#667eea", end: "#764ba2" },
        professional: { start: "#1e40af", end: "#1e3a8a" },
        vibrant: { start: "#ec4899", end: "#8b5cf6" },
        minimal: { start: "#6b7280", end: "#374151" }
    };
    
    // CSV Checker 用の設定でボタンを作成
    const config = HeaderPngUtils.csvChecker;
    const button = HeaderPngUtils.createButton(
        config.toolName,
        config.subtitle,
        'png-button-container'
    );
    
    // CSV Checker 用のスタイルカスタマイズ
    button.style.cssText += `
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 13px;
        height: 40px;
    `;
    
    // テーマ変更とPNG生成の統合
    button.onclick = () => {
        const themeSelector = document.getElementById('csv-theme-selector');
        const selectedTheme = themes[themeSelector.value];
        
        // 元の設定を保存
        const originalStart = PNG_CONFIG.gradientStart;
        const originalEnd = PNG_CONFIG.gradientEnd;
        
        // 選択されたテーマを適用
        if (selectedTheme) {
            PNG_CONFIG.gradientStart = selectedTheme.start;
            PNG_CONFIG.gradientEnd = selectedTheme.end;
        }
        
        // 現在読み込まれているCSVファイル情報を取得
        const fileInput = document.querySelector('input[type="file"]');
        const fileName = fileInput && fileInput.files[0] ? 
            fileInput.files[0].name : 'CSVファイル';
        
        // 動的なサブタイトル
        const dynamicSubtitle = `${fileName}の確認・編集 - ${new Date().toLocaleDateString('ja-JP')}`;
        
        exportHeaderAsPng(
            config.toolName,
            dynamicSubtitle,
            (message) => {
                showCsvCheckerNotification(message, themeSelector.options[themeSelector.selectedIndex].text);
                
                // 設定を復元
                PNG_CONFIG.gradientStart = originalStart;
                PNG_CONFIG.gradientEnd = originalEnd;
            }
        );
    };
}

function showCsvCheckerNotification(message, themeName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #1f2937;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        text-align: center;
        min-width: 300px;
        border: 2px solid #10b981;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #10b981;">
            生成完了！
        </div>
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
            ${message}
        </div>
        <div style="font-size: 12px; color: #9ca3af;">
            テーマ: ${themeName}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション効果
    notification.style.animation = 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// CSS アニメーション
const csvCheckerStyle = document.createElement('style');
csvCheckerStyle.textContent = `
    @keyframes bounceIn {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        70% { transform: translate(-50%, -50%) scale(0.9); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes fadeOut {
        to { transform: translate(-50%, -60px); opacity: 0; }
    }
`;
document.head.appendChild(csvCheckerStyle);
```

## 🎨 高度なカスタマイズ例

### 例6: リアルタイムプレビュー付き

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>リアルタイムプレビュー付きヘッダーPNG</title>
    <style>
        .preview-container {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
        
        .controls-panel {
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .preview-panel {
            flex: 1;
            text-align: center;
        }
        
        .preview-canvas {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            max-width: 100%;
            height: auto;
        }
        
        .control-group {
            margin-bottom: 15px;
        }
        
        .control-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #374151;
        }
        
        .control-group input,
        .control-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .color-input {
            height: 40px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .export-btn {
            width: 100%;
            padding: 12px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .export-btn:hover {
            background: #4338ca;
        }
    </style>
</head>
<body>
    <div id="app">
        <h1>🎨 リアルタイムヘッダーPNGジェネレーター</h1>
        
        <div class="preview-container">
            <div class="controls-panel">
                <h3>設定</h3>
                
                <div class="control-group">
                    <label for="tool-name">ツール名:</label>
                    <input type="text" id="tool-name" value="🚀 サンプルツール">
                </div>
                
                <div class="control-group">
                    <label for="subtitle">サブタイトル:</label>
                    <input type="text" id="subtitle" value="説明文をここに入力">
                </div>
                
                <div class="control-group">
                    <label for="width">幅 (px):</label>
                    <input type="number" id="width" value="1200" min="400" max="2400">
                </div>
                
                <div class="control-group">
                    <label for="height">高さ (px):</label>
                    <input type="number" id="height" value="300" min="150" max="800">
                </div>
                
                <div class="control-group">
                    <label for="start-color">開始色:</label>
                    <input type="color" id="start-color" value="#4f46e5" class="color-input">
                </div>
                
                <div class="control-group">
                    <label for="end-color">終了色:</label>
                    <input type="color" id="end-color" value="#7c3aed" class="color-input">
                </div>
                
                <div class="control-group">
                    <label for="corner-radius">角丸 (px):</label>
                    <input type="range" id="corner-radius" value="20" min="0" max="50">
                    <span id="radius-value">20px</span>
                </div>
                
                <button id="export-preview" class="export-btn">📸 プレビューをPNGで保存</button>
            </div>
            
            <div class="preview-panel">
                <h3>プレビュー</h3>
                <canvas id="preview-canvas" class="preview-canvas" width="400" height="100"></canvas>
                <p><small>実際のサイズの1/3で表示</small></p>
            </div>
        </div>
    </div>
    
    <script src="header-utils.js"></script>
    <script>
        class HeaderPngPreview {
            constructor() {
                this.previewCanvas = document.getElementById('preview-canvas');
                this.previewCtx = this.previewCanvas.getContext('2d');
                this.setupEventListeners();
                this.updatePreview();
            }
            
            setupEventListeners() {
                // すべての入力要素にイベントリスナーを追加
                const inputs = ['tool-name', 'subtitle', 'width', 'height', 'start-color', 'end-color', 'corner-radius'];
                
                inputs.forEach(id => {
                    const element = document.getElementById(id);
                    element.addEventListener('input', () => this.updatePreview());
                });
                
                // 角丸スライダーの値表示更新
                document.getElementById('corner-radius').addEventListener('input', (e) => {
                    document.getElementById('radius-value').textContent = e.target.value + 'px';
                });
                
                // エクスポートボタン
                document.getElementById('export-preview').addEventListener('click', () => {
                    this.exportFullSize();
                });
            }
            
            updatePreview() {
                const toolName = document.getElementById('tool-name').value;
                const subtitle = document.getElementById('subtitle').value;
                const width = parseInt(document.getElementById('width').value);
                const height = parseInt(document.getElementById('height').value);
                const startColor = document.getElementById('start-color').value;
                const endColor = document.getElementById('end-color').value;
                const cornerRadius = parseInt(document.getElementById('corner-radius').value);
                
                // プレビューサイズ（1/3スケール）
                const previewWidth = Math.round(width / 3);
                const previewHeight = Math.round(height / 3);
                
                this.previewCanvas.width = previewWidth;
                this.previewCanvas.height = previewHeight;
                
                // 背景グラデーション
                const gradient = this.previewCtx.createLinearGradient(0, 0, previewWidth, previewHeight);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                
                // 背景を描画
                this.previewCtx.fillStyle = gradient;
                this.drawRoundedRect(0, 0, previewWidth, previewHeight, cornerRadius / 3);
                this.previewCtx.fill();
                
                // テキストを描画
                this.previewCtx.fillStyle = "white";
                this.previewCtx.textAlign = "center";
                this.previewCtx.textBaseline = "middle";
                
                // メインタイトル
                const mainFontSize = Math.round(72 / 3);
                this.previewCtx.font = `bold ${mainFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
                this.previewCtx.fillText(toolName, previewWidth / 2, previewHeight / 2 - 10);
                
                // サブタイトル
                const subFontSize = Math.round(32 / 3);
                this.previewCtx.font = `${subFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
                this.previewCtx.globalAlpha = 0.9;
                this.previewCtx.fillText(subtitle, previewWidth / 2, previewHeight / 2 + 13);
                this.previewCtx.globalAlpha = 1;
            }
            
            drawRoundedRect(x, y, width, height, radius) {
                this.previewCtx.beginPath();
                this.previewCtx.moveTo(x + radius, y);
                this.previewCtx.lineTo(x + width - radius, y);
                this.previewCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.previewCtx.lineTo(x + width, y + height - radius);
                this.previewCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.previewCtx.lineTo(x + radius, y + height);
                this.previewCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.previewCtx.lineTo(x, y + radius);
                this.previewCtx.quadraticCurveTo(x, y, x + radius, y);
                this.previewCtx.closePath();
            }
            
            exportFullSize() {
                // 現在の設定を取得
                const toolName = document.getElementById('tool-name').value;
                const subtitle = document.getElementById('subtitle').value;
                const width = parseInt(document.getElementById('width').value);
                const height = parseInt(document.getElementById('height').value);
                const startColor = document.getElementById('start-color').value;
                const endColor = document.getElementById('end-color').value;
                const cornerRadius = parseInt(document.getElementById('corner-radius').value);
                
                // PNG_CONFIG を一時的に更新
                const originalConfig = { ...PNG_CONFIG };
                
                PNG_CONFIG.width = width;
                PNG_CONFIG.height = height;
                PNG_CONFIG.gradientStart = startColor;
                PNG_CONFIG.gradientEnd = endColor;
                PNG_CONFIG.cornerRadius = cornerRadius;
                
                // フォントサイズを比例的に調整
                const widthRatio = width / 1200;
                const heightRatio = height / 300;
                const avgRatio = (widthRatio + heightRatio) / 2;
                
                PNG_CONFIG.mainFontSize = `${Math.round(72 * avgRatio)}px`;
                PNG_CONFIG.subFontSize = `${Math.round(32 * avgRatio)}px`;
                
                // フルサイズでエクスポート
                exportHeaderAsPng(toolName, subtitle, (message) => {
                    alert(`カスタム設定で保存完了: ${message}`);
                    
                    // 設定を復元
                    Object.assign(PNG_CONFIG, originalConfig);
                });
            }
        }
        
        // プレビュー機能を初期化
        document.addEventListener('DOMContentLoaded', function() {
            new HeaderPngPreview();
        });
    </script>
</body>
</html>
```

### 例7: バッチ生成機能

```javascript
// 複数のヘッダーを一度に生成する高度な例
class BatchHeaderGenerator {
    constructor() {
        this.jobs = [];
        this.isProcessing = false;
        this.progressCallback = null;
    }
    
    // バッチジョブを追加
    addJob(toolName, subtitle, options = {}) {
        const job = {
            id: Date.now() + Math.random(),
            toolName,
            subtitle,
            options: {
                theme: 'default',
                size: 'standard',
                ...options
            },
            status: 'pending'
        };
        
        this.jobs.push(job);
        return job.id;
    }
    
    // 進捗コールバックを設定
    setProgressCallback(callback) {
        this.progressCallback = callback;
    }
    
    // バッチ処理を実行
    async processBatch() {
        if (this.isProcessing) {
            console.warn('既にバッチ処理が実行中です');
            return;
        }
        
        this.isProcessing = true;
        
        const totalJobs = this.jobs.length;
        let completedJobs = 0;
        
        for (const job of this.jobs) {
            try {
                job.status = 'processing';
                this.updateProgress(completedJobs, totalJobs, `${job.toolName}を生成中...`);
                
                await this.generateSingleHeader(job);
                
                job.status = 'completed';
                completedJobs++;
                
                this.updateProgress(completedJobs, totalJobs, `${job.toolName}が完了`);
                
                // 次のジョブまで少し待機
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                job.status = 'error';
                job.error = error.message;
                console.error(`ジョブ ${job.id} でエラー:`, error);
            }
        }
        
        this.isProcessing = false;
        this.updateProgress(totalJobs, totalJobs, 'すべての生成が完了しました！');
    }
    
    updateProgress(completed, total, message) {
        const percentage = Math.round((completed / total) * 100);
        
        if (this.progressCallback) {
            this.progressCallback({
                completed,
                total,
                percentage,
                message
            });
        }
    }
    
    async generateSingleHeader(job) {
        return new Promise((resolve, reject) => {
            // 元の設定を保存
            const originalConfig = { ...PNG_CONFIG };
            
            try {
                // ジョブの設定を適用
                this.applyJobSettings(job);
                
                // PNG生成
                exportHeaderAsPng(
                    job.toolName,
                    job.subtitle,
                    (message) => {
                        // 設定を復元
                        Object.assign(PNG_CONFIG, originalConfig);
                        resolve(message);
                    }
                );
                
            } catch (error) {
                // 設定を復元
                Object.assign(PNG_CONFIG, originalConfig);
                reject(error);
            }
        });
    }
    
    applyJobSettings(job) {
        const { options } = job;
        
        // テーマの適用
        const themes = {
            default: { start: "#4f46e5", end: "#7c3aed" },
            ocean: { start: "#0ea5e9", end: "#0284c7" },
            sunset: { start: "#f59e0b", end: "#dc2626" },
            forest: { start: "#059669", end: "#047857" }
        };
        
        const theme = themes[options.theme] || themes.default;
        PNG_CONFIG.gradientStart = theme.start;
        PNG_CONFIG.gradientEnd = theme.end;
        
        // サイズの適用
        const sizes = {
            small: { width: 800, height: 200 },
            standard: { width: 1200, height: 300 },
            large: { width: 1920, height: 480 }
        };
        
        const size = sizes[options.size] || sizes.standard;
        PNG_CONFIG.width = size.width;
        PNG_CONFIG.height = size.height;
        
        // フォントサイズの調整
        const ratio = Math.sqrt((size.width * size.height) / (1200 * 300));
        PNG_CONFIG.mainFontSize = `${Math.round(72 * ratio)}px`;
        PNG_CONFIG.subFontSize = `${Math.round(32 * ratio)}px`;
    }
    
    // ジョブをクリア
    clearJobs() {
        if (this.isProcessing) {
            console.warn('処理中のため、ジョブをクリアできません');
            return false;
        }
        
        this.jobs = [];
        return true;
    }
    
    // 処理状況を取得
    getStatus() {
        const pending = this.jobs.filter(job => job.status === 'pending').length;
        const processing = this.jobs.filter(job => job.status === 'processing').length;
        const completed = this.jobs.filter(job => job.status === 'completed').length;
        const errors = this.jobs.filter(job => job.status === 'error').length;
        
        return {
            total: this.jobs.length,
            pending,
            processing,
            completed,
            errors,
            isProcessing: this.isProcessing
        };
    }
}

// バッチ生成の使用例
function demonstrateBatchGeneration() {
    const batchGenerator = new BatchHeaderGenerator();
    
    // プログレス表示の設定
    batchGenerator.setProgressCallback((progress) => {
        console.log(`${progress.percentage}% - ${progress.message}`);
        updateProgressBar(progress.percentage, progress.message);
    });
    
    // 複数のヘッダーをキューに追加
    const tools = [
        { name: "🔗 URL to CSV", subtitle: "WebページからCSV生成", theme: "ocean", size: "standard" },
        { name: "📋 CSV Checker", subtitle: "画像URLの確認ツール", theme: "forest", size: "standard" },
        { name: "📊 Data Analyzer", subtitle: "データ分析ツール", theme: "sunset", size: "large" },
        { name: "🎨 Design Tool", subtitle: "クリエイティブツール", theme: "default", size: "small" }
    ];
    
    tools.forEach(tool => {
        batchGenerator.addJob(
            tool.name,
            tool.subtitle,
            {
                theme: tool.theme,
                size: tool.size
            }
        );
    });
    
    // バッチ処理を開始
    batchGenerator.processBatch().then(() => {
        console.log('すべてのヘッダー生成が完了しました');
        showBatchCompleteNotification(batchGenerator.getStatus());
    });
}

function updateProgressBar(percentage, message) {
    // プログレスバーの更新（実装は省略）
    console.log(`Progress: ${percentage}% - ${message}`);
}

function showBatchCompleteNotification(status) {
    alert(`バッチ生成完了!\n完了: ${status.completed}件\nエラー: ${status.errors}件`);
}
```

## 🎯 UI統合パターン

### 例8: モーダルダイアログでの設定

```javascript
// モーダルダイアログでヘッダーPNG設定を行う例
class HeaderPngModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
    }
    
    open(initialToolName = '', initialSubtitle = '') {
        if (this.isOpen) return;
        
        this.createModal(initialToolName, initialSubtitle);
        this.isOpen = true;
    }
    
    close() {
        if (this.modal) {
            document.body.removeChild(this.modal);
            this.modal = null;
            this.isOpen = false;
        }
    }
    
    createModal(toolName, subtitle) {
        // モーダルのHTML構造
        this.modal = document.createElement('div');
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        this.modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #1f2937;">📸 ヘッダーPNG設定</h2>
                    <button id="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">×</button>
                </div>
                
                <form id="header-png-form">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                            ツール名:
                        </label>
                        <input type="text" id="modal-tool-name" value="${toolName}" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e5e7eb;
                            border-radius: 6px;
                            font-size: 16px;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                            サブタイトル:
                        </label>
                        <input type="text" id="modal-subtitle" value="${subtitle}" style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #e5e7eb;
                            border-radius: 6px;
                            font-size: 16px;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                                テーマ:
                            </label>
                            <select id="modal-theme" style="
                                width: 100%;
                                padding: 10px;
                                border: 2px solid #e5e7eb;
                                border-radius: 6px;
                                font-size: 16px;
                                box-sizing: border-box;
                            ">
                                <option value="default">デフォルト</option>
                                <option value="ocean">オーシャン</option>
                                <option value="sunset">サンセット</option>
                                <option value="forest">フォレスト</option>
                                <option value="custom">カスタム</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                                サイズ:
                            </label>
                            <select id="modal-size" style="
                                width: 100%;
                                padding: 10px;
                                border: 2px solid #e5e7eb;
                                border-radius: 6px;
                                font-size: 16px;
                                box-sizing: border-box;
                            ">
                                <option value="small">小 (800x200)</option>
                                <option value="standard" selected>標準 (1200x300)</option>
                                <option value="large">大 (1920x480)</option>
                                <option value="twitter">Twitter (1200x675)</option>
                                <option value="instagram">Instagram (1080x1080)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div id="custom-colors" style="display: none; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                                開始色:
                            </label>
                            <input type="color" id="modal-start-color" value="#4f46e5" style="
                                width: 100%;
                                height: 50px;
                                border: 2px solid #e5e7eb;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
                                終了色:
                            </label>
                            <input type="color" id="modal-end-color" value="#7c3aed" style="
                                width: 100%;
                                height: 50px;
                                border: 2px solid #e5e7eb;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" id="cancel-modal" style="
                            padding: 12px 24px;
                            background: #f3f4f6;
                            color: #374151;
                            border: none;
                            border-radius: 6px;
                            font-size: 16px;
                            cursor: pointer;
                            font-weight: 600;
                        ">キャンセル</button>
                        
                        <button type="submit" style="
                            padding: 12px 24px;
                            background: #4f46e5;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 16px;
                            cursor: pointer;
                            font-weight: 600;
                        ">📸 PNG生成</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.modal.querySelector('#close-modal');
        const cancelBtn = this.modal.querySelector('#cancel-modal');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });
        
        // 背景クリックで閉じる
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // テーマ変更でカスタムカラー表示切り替え
        const themeSelect = this.modal.querySelector('#modal-theme');
        const customColors = this.modal.querySelector('#custom-colors');
        
        themeSelect.addEventListener('change', () => {
            if (themeSelect.value === 'custom') {
                customColors.style.display = 'grid';
            } else {
                customColors.style.display = 'none';
            }
        });
        
        // フォーム送信
        const form = this.modal.querySelector('#header-png-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePng();
        });
    }
    
    generatePng() {
        const toolName = this.modal.querySelector('#modal-tool-name').value;
        const subtitle = this.modal.querySelector('#modal-subtitle').value;
        const theme = this.modal.querySelector('#modal-theme').value;
        const size = this.modal.querySelector('#modal-size').value;
        
        // 設定を適用してPNG生成
        this.applySettings(theme, size);
        
        exportHeaderAsPng(toolName, subtitle, (message) => {
            this.showSuccess(message);
            this.close();
        });
    }
    
    applySettings(theme, size) {
        // テーマの適用
        const themes = {
            default: { start: "#4f46e5", end: "#7c3aed" },
            ocean: { start: "#0ea5e9", end: "#0284c7" },
            sunset: { start: "#f59e0b", end: "#dc2626" },
            forest: { start: "#059669", end: "#047857" },
            custom: {
                start: this.modal.querySelector('#modal-start-color').value,
                end: this.modal.querySelector('#modal-end-color').value
            }
        };
        
        const selectedTheme = themes[theme];
        PNG_CONFIG.gradientStart = selectedTheme.start;
        PNG_CONFIG.gradientEnd = selectedTheme.end;
        
        // サイズの適用
        const sizes = {
            small: { width: 800, height: 200 },
            standard: { width: 1200, height: 300 },
            large: { width: 1920, height: 480 },
            twitter: { width: 1200, height: 675 },
            instagram: { width: 1080, height: 1080 }
        };
        
        const selectedSize = sizes[size];
        PNG_CONFIG.width = selectedSize.width;
        PNG_CONFIG.height = selectedSize.height;
        
        // フォントサイズの調整
        const ratio = Math.sqrt((selectedSize.width * selectedSize.height) / (1200 * 300));
        PNG_CONFIG.mainFontSize = `${Math.round(72 * ratio)}px`;
        PNG_CONFIG.subFontSize = `${Math.round(32 * ratio)}px`;
    }
    
    showSuccess(message) {
        // 成功通知を表示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// モーダルの使用例
function openHeaderPngModal() {
    const modal = new HeaderPngModal();
    modal.open('🚀 サンプルツール', '高機能なツールの説明');
}

// ボタンに統合
document.addEventListener('DOMContentLoaded', function() {
    const button = document.createElement('button');
    button.textContent = '📸 ヘッダーPNG設定';
    button.onclick = openHeaderPngModal;
    
    document.body.appendChild(button);
});
```

## 🚨 エラーハンドリング例

### 例9: 包括的なエラーハンドリング

```javascript
class RobustHeaderPngGenerator {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.errorLog = [];
    }
    
    async generateWithErrorHandling(toolName, subtitle, options = {}) {
        let attempts = 0;
        let lastError = null;
        
        while (attempts < this.maxRetries) {
            try {
                attempts++;
                console.log(`PNG生成試行 ${attempts}/${this.maxRetries}`);
                
                // 基本的な入力検証
                this.validateInputs(toolName, subtitle);
                
                // ブラウザサポートチェック
                this.checkBrowserSupport();
                
                // Canvas APIの利用可能性チェック
                this.checkCanvasSupport();
                
                // PNG生成実行
                await this.generatePngSafely(toolName, subtitle, options);
                
                // 成功した場合はループを抜ける
                console.log('PNG生成が成功しました');
                return true;
                
            } catch (error) {
                lastError = error;
                this.logError(error, attempts);
                
                // 再試行不可能なエラーの場合は即座に終了
                if (this.isFatalError(error)) {
                    console.error('致命的なエラーのため、再試行を中止します:', error.message);
                    break;
                }
                
                // 最後の試行でない場合は待機
                if (attempts < this.maxRetries) {
                    console.log(`${this.retryDelay}ms後に再試行します...`);
                    await this.delay(this.retryDelay);
                    this.retryDelay *= 2; // 指数バックオフ
                }
            }
        }
        
        // すべての試行が失敗した場合
        this.handleFinalFailure(lastError, attempts);
        return false;
    }
    
    validateInputs(toolName, subtitle) {
        if (!toolName || typeof toolName !== 'string') {
            throw new Error('有効なツール名が必要です');
        }
        
        if (!subtitle || typeof subtitle !== 'string') {
            throw new Error('有効なサブタイトルが必要です');
        }
        
        if (toolName.length > 100) {
            throw new Error('ツール名が長すぎます（100文字以内）');
        }
        
        if (subtitle.length > 200) {
            throw new Error('サブタイトルが長すぎます（200文字以内）');
        }
    }
    
    checkBrowserSupport() {
        const requiredFeatures = {
            canvas: typeof HTMLCanvasElement !== 'undefined',
            blob: typeof Blob !== 'undefined',
            url: typeof URL !== 'undefined',
            createElement: typeof document.createElement === 'function'
        };
        
        const unsupported = Object.entries(requiredFeatures)
            .filter(([feature, supported]) => !supported)
            .map(([feature]) => feature);
        
        if (unsupported.length > 0) {
            throw new Error(`ブラウザが以下の機能をサポートしていません: ${unsupported.join(', ')}`);
        }
    }
    
    checkCanvasSupport() {
        try {
            const testCanvas = document.createElement('canvas');
            const ctx = testCanvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Canvas 2Dコンテキストが利用できません');
            }
            
            // 基本的な描画テスト
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 10, 10);
            
            // toBlob メソッドの確認
            if (typeof testCanvas.toBlob !== 'function') {
                throw new Error('Canvas.toBlob メソッドがサポートされていません');
            }
            
        } catch (error) {
            throw new Error(`Canvas機能のテストに失敗: ${error.message}`);
        }
    }
    
    async generatePngSafely(toolName, subtitle, options) {
        return new Promise((resolve, reject) => {
            try {
                // メモリ使用量のチェック
                this.checkMemoryUsage();
                
                // Canvas要素を作成
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 設定の妥当性チェック
                this.validatePngConfig();
                
                // キャンバスサイズを設定
                canvas.width = PNG_CONFIG.width;
                canvas.height = PNG_CONFIG.height;
                
                // 背景描画
                this.drawBackground(ctx);
                
                // テキスト描画
                this.drawText(ctx, toolName, subtitle);
                
                // PNG生成とダウンロード
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('PNG Blobの生成に失敗しました'));
                        return;
                    }
                    
                    try {
                        this.downloadBlob(blob, this.generateFilename(toolName));
                        resolve('PNG生成が完了しました');
                    } catch (downloadError) {
                        reject(new Error(`ダウンロードに失敗: ${downloadError.message}`));
                    }
                }, 'image/png', 0.9);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    checkMemoryUsage() {
        if (performance.memory) {
            const memoryInfo = performance.memory;
            const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
            const limitMB = memoryInfo.jsHeapSizeLimit / (1024 * 1024);
            
            if (usedMB / limitMB > 0.9) {
                console.warn('メモリ使用量が多いため、PNG生成が失敗する可能性があります');
            }
        }
    }
    
    validatePngConfig() {
        const config = PNG_CONFIG;
        
        if (config.width <= 0 || config.height <= 0) {
            throw new Error('無効なキャンバスサイズです');
        }
        
        if (config.width > 4096 || config.height > 4096) {
            throw new Error('キャンバスサイズが大きすぎます（最大: 4096x4096）');
        }
        
        if (!config.gradientStart || !config.gradientEnd) {
            throw new Error('グラデーション色が設定されていません');
        }
    }
    
    drawBackground(ctx) {
        try {
            const gradient = ctx.createLinearGradient(
                0, 0, PNG_CONFIG.width, PNG_CONFIG.height
            );
            gradient.addColorStop(0, PNG_CONFIG.gradientStart);
            gradient.addColorStop(1, PNG_CONFIG.gradientEnd);
            
            ctx.fillStyle = gradient;
            this.drawRoundedRect(ctx, 0, 0, PNG_CONFIG.width, PNG_CONFIG.height, PNG_CONFIG.cornerRadius);
            ctx.fill();
            
        } catch (error) {
            throw new Error(`背景描画に失敗: ${error.message}`);
        }
    }
    
    drawText(ctx, toolName, subtitle) {
        try {
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
            ctx.globalAlpha = 1;
            
        } catch (error) {
            throw new Error(`テキスト描画に失敗: ${error.message}`);
        }
    }
    
    drawRoundedRect(ctx, x, y, width, height, radius) {
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
    
    downloadBlob(blob, filename) {
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            // ダウンロードリンクをDOMに追加してクリック
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // メモリをクリーンアップ
            URL.revokeObjectURL(url);
            
        } catch (error) {
            throw new Error(`ファイルダウンロードに失敗: ${error.message}`);
        }
    }
    
    generateFilename(toolName) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
        const safeName = toolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        return `${safeName}-header-${timestamp}.png`;
    }
    
    isFatalError(error) {
        const fatalPatterns = [
            'ブラウザが.*をサポートしていません',
            'Canvas.*が利用できません',
            '無効なキャンバスサイズ',
            'キャンバスサイズが大きすぎます'
        ];
        
        return fatalPatterns.some(pattern => 
            new RegExp(pattern).test(error.message)
        );
    }
    
    logError(error, attempt) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            attempt,
            message: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent
        };
        
        this.errorLog.push(errorInfo);
        console.error(`PNG生成エラー (試行 ${attempt}):`, error);
    }
    
    handleFinalFailure(error, attempts) {
        const errorMessage = `PNG生成に失敗しました (${attempts}回試行)\n\n` +
                           `エラー: ${error.message}\n\n` +
                           `お使いのブラウザ: ${navigator.userAgent}\n\n` +
                           `対処方法:\n` +
                           `- ページを再読み込みしてから再試行してください\n` +
                           `- 別のブラウザで試してください\n` +
                           `- ブラウザを最新版に更新してください`;
        
        alert(errorMessage);
        
        // エラーログをコンソールに出力
        console.group('PNG生成エラーの詳細');
        console.log('エラーログ:', this.errorLog);
        console.groupEnd();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 公開メソッド: エラーログのエクスポート
    exportErrorLog() {
        const errorData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            errors: this.errorLog
        };
        
        const blob = new Blob([JSON.stringify(errorData, null, 2)], {
            type: 'application/json'
        });
        
        this.downloadBlob(blob, `header-png-errors-${Date.now()}.json`);
    }
}

// 堅牢なPNG生成の使用例
async function generateHeaderWithErrorHandling(toolName, subtitle) {
    const generator = new RobustHeaderPngGenerator();
    
    const success = await generator.generateWithErrorHandling(toolName, subtitle);
    
    if (!success) {
        // エラーログのエクスポートオプションを提供
        const exportLogs = confirm('エラーログをダウンロードしますか？（技術サポート用）');
        if (exportLogs) {
            generator.exportErrorLog();
        }
    }
}

// 使用例
document.addEventListener('DOMContentLoaded', function() {
    const button = document.createElement('button');
    button.textContent = '📸 安全なヘッダーPNG生成';
    button.onclick = () => {
        generateHeaderWithErrorHandling('🛡️ セキュアツール', '安全性を重視したツール');
    };
    
    document.body.appendChild(button);
});
```

これらの実装例を参考に、プロジェクトの要件に応じてヘッダーPNG機能をカスタマイズしてください。各例はコピー&ペーストで使用できるように設計されており、必要に応じて組み合わせることも可能です。
