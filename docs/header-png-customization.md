# ヘッダーPNG機能のカスタマイズガイド

このドキュメントでは、ヘッダーPNG保存機能の詳細なカスタマイズ方法について説明します。デザイン、テーマ、レイアウト、およびエクスポート設定の変更方法を含みます。

## 📋 目次

1. [基本設定のカスタマイズ](#基本設定のカスタマイズ)
2. [テーマとカラーリング](#テーマとカラーリング)
3. [フォントとタイポグラフィ](#フォントとタイポグラフィ)
4. [レイアウトとサイズ](#レイアウトとサイズ)
5. [高度なカスタマイズ](#高度なカスタマイズ)
6. [パフォーマンス最適化](#パフォーマンス最適化)

## ⚙️ 基本設定のカスタマイズ

### PNG_CONFIG オブジェクトの理解

`header-utils.js` の `PNG_CONFIG` オブジェクトがすべての基本設定を管理しています：

```javascript
const PNG_CONFIG = {
    width: 1200,              // 出力画像の幅（ピクセル）
    height: 300,              // 出力画像の高さ（ピクセル）
    cornerRadius: 20,         // 角丸の半径（ピクセル）
    gradientStart: "#4f46e5", // グラデーション開始色
    gradientEnd: "#7c3aed",   // グラデーション終了色
    mainFontSize: "72px",     // メインタイトルのフォントサイズ
    subFontSize: "32px",      // サブタイトルのフォントサイズ
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};
```

### 基本設定の変更方法

#### 1. 直接的な設定変更

```javascript
// 設定を直接変更
PNG_CONFIG.width = 1600;           // より大きなサイズ
PNG_CONFIG.height = 400;
PNG_CONFIG.cornerRadius = 30;      // より丸い角
PNG_CONFIG.mainFontSize = "84px";  // より大きなフォント
```

#### 2. 一時的な設定変更

```javascript
function exportWithCustomSettings(toolName, subtitle, customConfig) {
    // 元の設定を保存
    const originalConfig = { ...PNG_CONFIG };
    
    // カスタム設定を適用
    Object.assign(PNG_CONFIG, customConfig);
    
    // PNG生成実行
    exportHeaderAsPng(toolName, subtitle, (message) => {
        console.log(message);
        
        // 設定を復元
        Object.assign(PNG_CONFIG, originalConfig);
    });
}

// 使用例
exportWithCustomSettings(
    "カスタムツール",
    "特別な設定での出力",
    {
        width: 1920,
        height: 480,
        cornerRadius: 40,
        gradientStart: "#ff6b6b",
        gradientEnd: "#ee5a24"
    }
);
```

#### 3. 設定オブジェクトクラスによる管理

```javascript
class PngConfigManager {
    constructor() {
        this.defaultConfig = { ...PNG_CONFIG };
        this.currentConfig = { ...PNG_CONFIG };
    }
    
    // 設定プリセット
    static PRESETS = {
        small: {
            width: 800,
            height: 200,
            mainFontSize: "48px",
            subFontSize: "24px",
            cornerRadius: 15
        },
        large: {
            width: 1920,
            height: 480,
            mainFontSize: "96px",
            subFontSize: "44px",
            cornerRadius: 30
        },
        square: {
            width: 600,
            height: 600,
            mainFontSize: "60px",
            subFontSize: "30px",
            cornerRadius: 25
        }
    };
    
    applyPreset(presetName) {
        const preset = PngConfigManager.PRESETS[presetName];
        if (preset) {
            this.currentConfig = { ...this.defaultConfig, ...preset };
            Object.assign(PNG_CONFIG, this.currentConfig);
        }
    }
    
    applyCustom(customConfig) {
        this.currentConfig = { ...this.defaultConfig, ...customConfig };
        Object.assign(PNG_CONFIG, this.currentConfig);
    }
    
    reset() {
        this.currentConfig = { ...this.defaultConfig };
        Object.assign(PNG_CONFIG, this.defaultConfig);
    }
    
    getCurrentConfig() {
        return { ...this.currentConfig };
    }
}

// 使用例
const configManager = new PngConfigManager();

// プリセットを適用
configManager.applyPreset('large');
exportHeaderAsPng("大きなヘッダー", "1920x480サイズ");

// カスタム設定を適用
configManager.applyCustom({
    gradientStart: "#667eea",
    gradientEnd: "#764ba2",
    cornerRadius: 50
});
exportHeaderAsPng("カスタムヘッダー", "独自の設定");

// デフォルトに戻す
configManager.reset();
```

## 🎨 テーマとカラーリング

### プリセットテーマの作成

```javascript
const THEME_PRESETS = {
    // デフォルト（インディゴ・パープル）
    default: {
        gradientStart: "#4f46e5",
        gradientEnd: "#7c3aed",
        name: "デフォルト",
        description: "標準的なインディゴからパープルのグラデーション"
    },
    
    // オーシャン（ブルー系）
    ocean: {
        gradientStart: "#0ea5e9",
        gradientEnd: "#0284c7",
        name: "オーシャン",
        description: "海を思わせる青いグラデーション"
    },
    
    // サンセット（オレンジ・レッド系）
    sunset: {
        gradientStart: "#f59e0b",
        gradientEnd: "#dc2626",
        name: "サンセット",
        description: "夕日のような暖かいグラデーション"
    },
    
    // フォレスト（グリーン系）
    forest: {
        gradientStart: "#059669",
        gradientEnd: "#047857",
        name: "フォレスト",
        description: "森林をイメージした緑のグラデーション"
    },
    
    // ローズ（ピンク系）
    rose: {
        gradientStart: "#ec4899",
        gradientEnd: "#be185d",
        name: "ローズ",
        description: "エレガントなピンクのグラデーション"
    },
    
    // モノクローム（グレー系）
    monochrome: {
        gradientStart: "#6b7280",
        gradientEnd: "#374151",
        name: "モノクローム",
        description: "洗練されたグレーのグラデーション"
    },
    
    // ビビッド（鮮やかな色彩）
    vivid: {
        gradientStart: "#8b5cf6",
        gradientEnd: "#06b6d4",
        name: "ビビッド",
        description: "鮮やかで印象的なグラデーション"
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.customThemes = new Map();
    }
    
    // テーマを適用
    applyTheme(themeName) {
        const theme = THEME_PRESETS[themeName] || this.customThemes.get(themeName);
        
        if (theme) {
            PNG_CONFIG.gradientStart = theme.gradientStart;
            PNG_CONFIG.gradientEnd = theme.gradientEnd;
            this.currentTheme = themeName;
            
            console.log(`テーマ「${theme.name}」を適用しました`);
            return true;
        }
        
        console.error(`テーマ「${themeName}」が見つかりません`);
        return false;
    }
    
    // カスタムテーマを作成
    createCustomTheme(name, gradientStart, gradientEnd, description = '') {
        this.customThemes.set(name, {
            gradientStart,
            gradientEnd,
            name,
            description
        });
    }
    
    // 利用可能なテーマの一覧を取得
    getAvailableThemes() {
        const presetThemes = Object.keys(THEME_PRESETS);
        const customThemes = Array.from(this.customThemes.keys());
        
        return {
            presets: presetThemes,
            custom: customThemes,
            all: [...presetThemes, ...customThemes]
        };
    }
    
    // 現在のテーマ情報を取得
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            gradientStart: PNG_CONFIG.gradientStart,
            gradientEnd: PNG_CONFIG.gradientEnd
        };
    }
}

// 使用例
const themeManager = new ThemeManager();

// プリセットテーマを適用
themeManager.applyTheme('ocean');
exportHeaderAsPng("オーシャンテーマ", "青い海のようなヘッダー");

// カスタムテーマを作成
themeManager.createCustomTheme(
    'corporate',
    '#1e40af',  // 企業ブルー
    '#1e3a8a',  // ダークブルー
    '企業向けのプロフェッショナルなテーマ'
);

themeManager.applyTheme('corporate');
exportHeaderAsPng("企業ツール", "プロフェッショナルなビジネスツール");
```

### 高度なカラーカスタマイズ

#### 1. 複雑なグラデーション

```javascript
function createComplexGradient(ctx, width, height) {
    // 放射状グラデーション
    const radialGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,           // 中心点 (開始)
        width / 2, height / 2, width / 2    // 中心点 (終了)
    );
    
    radialGradient.addColorStop(0, "#8b5cf6");    // 中心: バイオレット
    radialGradient.addColorStop(0.6, "#3b82f6");  // 中間: ブルー
    radialGradient.addColorStop(1, "#1e40af");     // 外側: ダークブルー
    
    return radialGradient;
}

// カスタムグラデーション生成関数を追加
function exportHeaderWithComplexGradient(toolName, subtitle) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = PNG_CONFIG.width;
    canvas.height = PNG_CONFIG.height;
    
    // 複雑なグラデーションを適用
    const gradient = createComplexGradient(ctx, PNG_CONFIG.width, PNG_CONFIG.height);
    
    ctx.fillStyle = gradient;
    drawRoundedRect(
        ctx, 0, 0,
        PNG_CONFIG.width,
        PNG_CONFIG.height,
        PNG_CONFIG.cornerRadius
    );
    ctx.fill();
    
    // テキストを描画（既存のロジックを使用）
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.fillText(toolName, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - 30);
    
    ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(subtitle, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + 40);
    
    // ダウンロード処理
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-complex-gradient.png`;
        a.click();
        URL.revokeObjectURL(url);
    }, "image/png");
}
```

#### 2. パターンとテクスチャ

```javascript
function createPatternBackground(ctx, width, height) {
    // パターン用のキャンバスを作成
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    
    // パターンサイズ
    patternCanvas.width = 40;
    patternCanvas.height = 40;
    
    // ベースカラー
    patternCtx.fillStyle = PNG_CONFIG.gradientStart;
    patternCtx.fillRect(0, 0, 40, 40);
    
    // パターンを描画（ドット）
    patternCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    patternCtx.beginPath();
    patternCtx.arc(20, 20, 3, 0, Math.PI * 2);
    patternCtx.fill();
    
    // パターンを作成
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    
    return pattern;
}

function exportHeaderWithPattern(toolName, subtitle) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = PNG_CONFIG.width;
    canvas.height = PNG_CONFIG.height;
    
    // パターン背景を適用
    const pattern = createPatternBackground(ctx, PNG_CONFIG.width, PNG_CONFIG.height);
    
    ctx.fillStyle = pattern;
    drawRoundedRect(
        ctx, 0, 0,
        PNG_CONFIG.width,
        PNG_CONFIG.height,
        PNG_CONFIG.cornerRadius
    );
    ctx.fill();
    
    // 半透明のオーバーレイを追加
    const overlay = ctx.createLinearGradient(0, 0, PNG_CONFIG.width, PNG_CONFIG.height);
    overlay.addColorStop(0, 'rgba(79, 70, 229, 0.7)');
    overlay.addColorStop(1, 'rgba(124, 58, 237, 0.7)');
    
    ctx.fillStyle = overlay;
    drawRoundedRect(
        ctx, 0, 0,
        PNG_CONFIG.width,
        PNG_CONFIG.height,
        PNG_CONFIG.cornerRadius
    );
    ctx.fill();
    
    // テキスト描画
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.fillText(toolName, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - 30);
    
    ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(subtitle, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + 40);
    
    // ダウンロード処理
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-pattern.png`;
        a.click();
        URL.revokeObjectURL(url);
    }, "image/png");
}
```

## 📝 フォントとタイポグラフィ

### 日本語フォントの最適化

```javascript
const JAPANESE_FONT_STACKS = {
    // 現代的なシステムフォント
    modern: `
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Yu Gothic UI",
        "Yu Gothic",
        "Meiryo UI",
        "Meiryo",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif
    `.replace(/\s+/g, ' ').trim(),
    
    // 読みやすさ重視
    readable: `
        "Noto Sans JP",
        "Source Han Sans JP",
        "Hiragino Kaku Gothic ProN",
        "Yu Gothic",
        "Meiryo",
        sans-serif
    `.replace(/\s+/g, ' ').trim(),
    
    // 見出し用（インパクト重視）
    heading: `
        "Hiragino Kaku Gothic StdN",
        "Hiragino Sans",
        "Yu Gothic UI",
        "Yu Gothic",
        "MS PGothic",
        sans-serif
    `.replace(/\s+/g, ' ').trim(),
    
    // 明朝体（フォーマル）
    serif: `
        "Hiragino Mincho ProN",
        "Yu Mincho",
        "YuMincho",
        "HiraMinProN-W3",
        "Meiryo",
        serif
    `.replace(/\s+/g, ' ').trim()
};

class TypographyManager {
    constructor() {
        this.fontStack = JAPANESE_FONT_STACKS.modern;
    }
    
    setFontStack(stackName) {
        if (JAPANESE_FONT_STACKS[stackName]) {
            this.fontStack = JAPANESE_FONT_STACKS[stackName];
            PNG_CONFIG.fontFamily = this.fontStack;
        }
    }
    
    // テキストのメトリクスを計算
    calculateTextMetrics(text, fontSize, fontFamily = this.fontStack) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize} ${fontFamily}`;
        
        const metrics = ctx.measureText(text);
        return {
            width: metrics.width,
            height: parseInt(fontSize),
            actualHeight: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        };
    }
    
    // テキストサイズの自動調整
    autoAdjustFontSize(text, maxWidth, maxHeight, baseFontSize = 72) {
        let fontSize = baseFontSize;
        let metrics;
        
        do {
            metrics = this.calculateTextMetrics(text, `${fontSize}px`);
            if (metrics.width <= maxWidth && metrics.actualHeight <= maxHeight) {
                break;
            }
            fontSize -= 2;
        } while (fontSize > 20);
        
        return `${fontSize}px`;
    }
    
    // 複数行テキストのレイアウト計算
    calculateMultilineLayout(lines, maxWidth, baseHeight) {
        const layouts = [];
        let totalHeight = 0;
        
        lines.forEach((line, index) => {
            const fontSize = this.autoAdjustFontSize(line, maxWidth, baseHeight / lines.length);
            const metrics = this.calculateTextMetrics(line, fontSize);
            
            layouts.push({
                text: line,
                fontSize,
                width: metrics.width,
                height: metrics.actualHeight,
                y: totalHeight + metrics.actualHeight
            });
            
            totalHeight += metrics.actualHeight + 10; // 行間
        });
        
        return layouts;
    }
}

// 使用例
const typography = new TypographyManager();

// 見出し用フォントを設定
typography.setFontStack('heading');

// 自動サイズ調整付きでPNG生成
function exportWithAutoSizedText(toolName, subtitle) {
    const maxWidth = PNG_CONFIG.width * 0.8; // 幅の80%を使用
    
    // フォントサイズを自動調整
    const mainFontSize = typography.autoAdjustFontSize(toolName, maxWidth, 100);
    const subFontSize = typography.autoAdjustFontSize(subtitle, maxWidth, 50);
    
    // 一時的に設定を変更
    const originalMainSize = PNG_CONFIG.mainFontSize;
    const originalSubSize = PNG_CONFIG.subFontSize;
    
    PNG_CONFIG.mainFontSize = mainFontSize;
    PNG_CONFIG.subFontSize = subFontSize;
    
    exportHeaderAsPng(toolName, subtitle, (message) => {
        console.log(`自動調整されたフォントサイズで生成: ${mainFontSize}, ${subFontSize}`);
        
        // 設定を復元
        PNG_CONFIG.mainFontSize = originalMainSize;
        PNG_CONFIG.subFontSize = originalSubSize;
    });
}
```

### カスタムフォント効果

```javascript
function exportHeaderWithTextEffects(toolName, subtitle) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = PNG_CONFIG.width;
    canvas.height = PNG_CONFIG.height;
    
    // 背景描画
    const gradient = ctx.createLinearGradient(0, 0, PNG_CONFIG.width, PNG_CONFIG.height);
    gradient.addColorStop(0, PNG_CONFIG.gradientStart);
    gradient.addColorStop(1, PNG_CONFIG.gradientEnd);
    
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, 0, 0, PNG_CONFIG.width, PNG_CONFIG.height, PNG_CONFIG.cornerRadius);
    ctx.fill();
    
    // テキスト効果の設定
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // メインタイトル（グロー効果付き）
    const mainX = PNG_CONFIG.width / 2;
    const mainY = PNG_CONFIG.height / 2 - 30;
    
    // グロー効果
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // アウトライン
    ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 4;
    ctx.strokeText(toolName, mainX, mainY);
    
    // メインテキスト
    ctx.fillStyle = "white";
    ctx.fillText(toolName, mainX, mainY);
    
    // シャドウをリセット
    ctx.shadowBlur = 0;
    
    // サブタイトル（グラデーション文字）
    const subX = PNG_CONFIG.width / 2;
    const subY = PNG_CONFIG.height / 2 + 40;
    
    // サブタイトル用グラデーション
    const textGradient = ctx.createLinearGradient(
        subX - 200, subY,
        subX + 200, subY
    );
    textGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    textGradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
    textGradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
    
    ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
    ctx.fillStyle = textGradient;
    ctx.fillText(subtitle, subX, subY);
    
    // ダウンロード処理
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-effects.png`;
        a.click();
        URL.revokeObjectURL(url);
    }, "image/png");
}
```

## 📐 レイアウトとサイズ

### レスポンシブサイズ対応

```javascript
const SIZE_PRESETS = {
    // ソーシャルメディア用
    twitter: { width: 1200, height: 675, ratio: '16:9' },
    facebook: { width: 1200, height: 630, ratio: '1.91:1' },
    instagram: { width: 1080, height: 1080, ratio: '1:1' },
    linkedin: { width: 1200, height: 627, ratio: '1.91:1' },
    
    // 印刷用
    a4Landscape: { width: 1169, height: 827, ratio: 'A4 横' },
    a4Portrait: { width: 827, height: 1169, ratio: 'A4 縦' },
    
    // Web用
    banner: { width: 1920, height: 480, ratio: '4:1' },
    hero: { width: 1920, height: 1080, ratio: '16:9' },
    thumbnail: { width: 400, height: 300, ratio: '4:3' },
    
    // プレゼンテーション用
    slide: { width: 1920, height: 1080, ratio: '16:9' },
    widescreen: { width: 1600, height: 900, ratio: '16:9' }
};

class LayoutManager {
    constructor() {
        this.currentPreset = 'default';
    }
    
    applyPreset(presetName) {
        const preset = SIZE_PRESETS[presetName];
        if (preset) {
            PNG_CONFIG.width = preset.width;
            PNG_CONFIG.height = preset.height;
            
            // フォントサイズを比例的に調整
            this.adjustFontSizes(preset);
            
            this.currentPreset = presetName;
            console.log(`レイアウト「${presetName}」(${preset.ratio})を適用しました`);
        }
    }
    
    adjustFontSizes(preset) {
        // 基準サイズ（1200x300）からの比率を計算
        const widthRatio = preset.width / 1200;
        const heightRatio = preset.height / 300;
        const avgRatio = (widthRatio + heightRatio) / 2;
        
        // フォントサイズを比例的に調整
        const baseMainSize = 72;
        const baseSubSize = 32;
        
        PNG_CONFIG.mainFontSize = `${Math.round(baseMainSize * avgRatio)}px`;
        PNG_CONFIG.subFontSize = `${Math.round(baseSubSize * avgRatio)}px`;
        
        // 角丸も調整
        PNG_CONFIG.cornerRadius = Math.round(20 * avgRatio);
    }
    
    // カスタムサイズでの生成
    exportCustomSize(toolName, subtitle, width, height, options = {}) {
        const originalConfig = {
            width: PNG_CONFIG.width,
            height: PNG_CONFIG.height,
            mainFontSize: PNG_CONFIG.mainFontSize,
            subFontSize: PNG_CONFIG.subFontSize,
            cornerRadius: PNG_CONFIG.cornerRadius
        };
        
        // カスタムサイズを適用
        PNG_CONFIG.width = width;
        PNG_CONFIG.height = height;
        
        if (options.autoAdjustFonts !== false) {
            this.adjustFontSizes({ width, height });
        }
        
        if (options.cornerRadius) {
            PNG_CONFIG.cornerRadius = options.cornerRadius;
        }
        
        exportHeaderAsPng(toolName, subtitle, (message) => {
            console.log(`カスタムサイズ ${width}x${height} で生成完了`);
            
            // 設定を復元
            Object.assign(PNG_CONFIG, originalConfig);
        });
    }
    
    // 複数サイズでの一括生成
    exportMultipleSizes(toolName, subtitle, presets = ['twitter', 'instagram', 'banner']) {
        const originalConfig = { ...PNG_CONFIG };
        
        presets.forEach((presetName, index) => {
            setTimeout(() => {
                this.applyPreset(presetName);
                
                // ファイル名にサイズ情報を含める
                const preset = SIZE_PRESETS[presetName];
                const customExport = (name, sub, callback) => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    
                    canvas.width = PNG_CONFIG.width;
                    canvas.height = PNG_CONFIG.height;
                    
                    // 背景とテキストを描画（既存ロジック使用）
                    const gradient = ctx.createLinearGradient(0, 0, PNG_CONFIG.width, PNG_CONFIG.height);
                    gradient.addColorStop(0, PNG_CONFIG.gradientStart);
                    gradient.addColorStop(1, PNG_CONFIG.gradientEnd);
                    
                    ctx.fillStyle = gradient;
                    drawRoundedRect(ctx, 0, 0, PNG_CONFIG.width, PNG_CONFIG.height, PNG_CONFIG.cornerRadius);
                    ctx.fill();
                    
                    // テキスト描画
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    
                    ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
                    ctx.fillText(name, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - (PNG_CONFIG.height * 0.1));
                    
                    ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
                    ctx.globalAlpha = 0.9;
                    ctx.fillText(sub, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + (PNG_CONFIG.height * 0.1));
                    
                    // ダウンロード
                    canvas.toBlob(function (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-${presetName}-${preset.width}x${preset.height}.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                        
                        if (callback) callback(`${presetName} サイズで保存完了`);
                    }, "image/png");
                };
                
                customExport(toolName, subtitle, (message) => {
                    console.log(message);
                    
                    // 最後のプリセットの場合、設定を復元
                    if (index === presets.length - 1) {
                        Object.assign(PNG_CONFIG, originalConfig);
                    }
                });
                
            }, index * 500); // 500ms間隔で実行
        });
    }
}

// 使用例
const layoutManager = new LayoutManager();

// Twitter用サイズで生成
layoutManager.applyPreset('twitter');
exportHeaderAsPng("Twitterヘッダー", "ソーシャルメディア用");

// 複数サイズで一括生成
layoutManager.exportMultipleSizes(
    "マルチサイズヘッダー",
    "様々なプラットフォーム対応",
    ['twitter', 'instagram', 'facebook', 'banner']
);

// カスタムサイズで生成
layoutManager.exportCustomSize(
    "カスタムヘッダー",
    "独自サイズでの出力",
    800,
    600,
    {
        autoAdjustFonts: true,
        cornerRadius: 15
    }
);
```

## 🚀 高度なカスタマイズ

### アニメーション効果（CSS用）

ヘッダーPNG機能と連携したCSS アニメーション：

```css
/* ヘッダーPNGボタンのアニメーション */
@keyframes headerPngPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
        transform: scale(1.05);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
        transform: scale(1);
    }
}

.header-png-button-animated {
    animation: headerPngPulse 2s infinite;
}

/* 生成完了時のフィードバック */
@keyframes successBounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        transform: translate3d(0, -8px, 0);
    }
    70% {
        transform: translate3d(0, -4px, 0);
    }
    90% {
        transform: translate3d(0, -2px, 0);
    }
}

.png-success-notification {
    animation: successBounce 1s ease;
}
```

### プログレス表示機能

```javascript
class PngExportProgress {
    constructor() {
        this.progressElement = null;
    }
    
    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'png-export-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 10000;
            text-align: center;
            min-width: 300px;
        `;
        
        progressContainer.innerHTML = `
            <div class="progress-icon">🎨</div>
            <div class="progress-text">PNG画像を生成中...</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);
        this.progressElement = progressContainer;
        
        // CSS for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .progress-icon {
                font-size: 32px;
                margin-bottom: 10px;
                animation: rotate 2s linear infinite;
            }
            
            .progress-text {
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4f46e5, #7c3aed);
                width: 0%;
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    updateProgress(percentage, message) {
        if (this.progressElement) {
            const fillElement = this.progressElement.querySelector('.progress-fill');
            const textElement = this.progressElement.querySelector('.progress-text');
            
            if (fillElement) {
                fillElement.style.width = `${percentage}%`;
            }
            
            if (textElement && message) {
                textElement.textContent = message;
            }
        }
    }
    
    complete(successMessage) {
        if (this.progressElement) {
            const iconElement = this.progressElement.querySelector('.progress-icon');
            const textElement = this.progressElement.querySelector('.progress-text');
            
            if (iconElement) iconElement.textContent = '✅';
            if (textElement) textElement.textContent = successMessage;
            
            this.updateProgress(100);
            
            setTimeout(() => {
                this.hide();
            }, 2000);
        }
    }
    
    hide() {
        if (this.progressElement) {
            this.progressElement.style.opacity = '0';
            this.progressElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
            this.progressElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                if (this.progressElement) {
                    document.body.removeChild(this.progressElement);
                    this.progressElement = null;
                }
            }, 300);
        }
    }
}

// プログレス付きでPNG生成
async function exportHeaderWithProgress(toolName, subtitle) {
    const progress = new PngExportProgress();
    
    try {
        progress.createProgressIndicator();
        
        // ステップ1: キャンバス準備
        progress.updateProgress(20, 'キャンバスを準備中...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = PNG_CONFIG.width;
        canvas.height = PNG_CONFIG.height;
        
        // ステップ2: 背景描画
        progress.updateProgress(40, '背景を描画中...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const gradient = ctx.createLinearGradient(0, 0, PNG_CONFIG.width, PNG_CONFIG.height);
        gradient.addColorStop(0, PNG_CONFIG.gradientStart);
        gradient.addColorStop(1, PNG_CONFIG.gradientEnd);
        
        ctx.fillStyle = gradient;
        drawRoundedRect(ctx, 0, 0, PNG_CONFIG.width, PNG_CONFIG.height, PNG_CONFIG.cornerRadius);
        ctx.fill();
        
        // ステップ3: テキスト描画
        progress.updateProgress(70, 'テキストを描画中...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
        ctx.fillText(toolName, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - 30);
        
        ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
        ctx.globalAlpha = 0.9;
        ctx.fillText(subtitle, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + 40);
        
        // ステップ4: ファイル生成
        progress.updateProgress(90, 'ファイルを生成中...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-header.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            progress.complete('PNG画像の保存が完了しました！');
        }, "image/png");
        
    } catch (error) {
        console.error('PNG生成エラー:', error);
        progress.hide();
        alert('PNG生成中にエラーが発生しました');
    }
}
```

## ⚡ パフォーマンス最適化

### メモリ効率の改善

```javascript
class CanvasPool {
    constructor(maxSize = 3) {
        this.pool = [];
        this.maxSize = maxSize;
    }
    
    getCanvas() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        
        const canvas = document.createElement('canvas');
        return canvas;
    }
    
    releaseCanvas(canvas) {
        if (this.pool.length < this.maxSize) {
            // キャンバスをクリア
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.pool.push(canvas);
        }
    }
    
    clear() {
        this.pool = [];
    }
}

const canvasPool = new CanvasPool();

// 最適化されたPNG生成
function optimizedExportHeaderAsPng(toolName, subtitle) {
    const canvas = canvasPool.getCanvas();
    const ctx = canvas.getContext("2d");
    
    try {
        // 高DPI対応
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaledWidth = PNG_CONFIG.width * devicePixelRatio;
        const scaledHeight = PNG_CONFIG.height * devicePixelRatio;
        
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        canvas.style.width = PNG_CONFIG.width + 'px';
        canvas.style.height = PNG_CONFIG.height + 'px';
        
        // コンテキストをスケール
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // 背景描画
        const gradient = ctx.createLinearGradient(0, 0, PNG_CONFIG.width, PNG_CONFIG.height);
        gradient.addColorStop(0, PNG_CONFIG.gradientStart);
        gradient.addColorStop(1, PNG_CONFIG.gradientEnd);
        
        ctx.fillStyle = gradient;
        drawRoundedRect(ctx, 0, 0, PNG_CONFIG.width, PNG_CONFIG.height, PNG_CONFIG.cornerRadius);
        ctx.fill();
        
        // テキスト描画
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.font = `bold ${PNG_CONFIG.mainFontSize} ${PNG_CONFIG.fontFamily}`;
        ctx.fillText(toolName, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 - 30);
        
        ctx.font = `${PNG_CONFIG.subFontSize} ${PNG_CONFIG.fontFamily}`;
        ctx.globalAlpha = 0.9;
        ctx.fillText(subtitle, PNG_CONFIG.width / 2, PNG_CONFIG.height / 2 + 40);
        
        // 高品質設定でBlob生成
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-header-hd.png`;
            a.click();
            
            // メモリクリーンアップ
            URL.revokeObjectURL(url);
            canvasPool.releaseCanvas(canvas);
            
        }, "image/png", 0.95); // 高品質設定
        
    } catch (error) {
        console.error('最適化PNG生成エラー:', error);
        canvasPool.releaseCanvas(canvas);
        throw error;
    }
}
```

このカスタマイズガイドを参考に、プロジェクトの要件に合わせてヘッダーPNG機能を柔軟に調整してください。
