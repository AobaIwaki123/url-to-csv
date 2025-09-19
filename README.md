# Net2Sheet - Chrome拡張機能

Chrome DevToolsで画像リクエストを収集し、CSV形式でエクスポートするChrome拡張機能です。

## 📋 概要

Net2SheetはWeb開発者やコンテンツ管理者向けの拡張機能で、ブラウザのネットワーク通信を監視して画像リソースの情報を効率的に収集・分析できます。

### ✨ 主な機能

- 📡 **リアルタイム画像監視**: DevToolsでネットワーク通信を監視し、画像リクエストを自動収集
- 📁 **多様な画像形式対応**: PNG, JPEG, GIF, WebP, SVG, AVIF, BMP, ICO
- 📊 **CSV出力**: 収集したデータをCSV形式でダウンロード
- 🔄 **GAS連携**: Google Apps Script WebAppとの連携でスプレッドシートに直接送信
- 🎯 **ユーザーフレンドリー**: 直感的なDevToolsパネルUI

## 🚀 インストール方法

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/net2sheet.git
cd net2sheet
```

### 2. Chrome拡張機能として読み込み
1. Chromeで `chrome://extensions/` を開く
2. 右上の「**デベロッパーモード**」をONにする
3. 「**パッケージ化されていない拡張機能を読み込む**」をクリック
4. `net2sheet` フォルダを選択

### 3. 動作確認
1. 任意のWebページで **F12** キーを押してDevToolsを開く
2. タブ一覧に「**Net2Sheet**」が表示されることを確認

## 📖 使用方法

### 基本的な操作フロー

1. **DevToolsを開く**: F12キーまたは右クリック→「検証」
2. **Net2Sheetタブを選択**: DevToolsのタブ一覧から選択
3. **収集開始**: 「収集開始」ボタンをクリック
4. **ページ操作**: 対象のWebページを再読み込みまたは操作
5. **データ確認**: プレビューエリアで収集されたデータを確認
6. **CSV出力**: 「CSVダウンロード」ボタンでファイルをダウンロード

### 詳細手順

#### 🎯 画像収集
```
1. 「収集開始」ボタンをクリック
   → アラート: "収集を開始しました。ページを再読み込みしてください。"

2. ページを再読み込み（F5）または画像を含むページに移動
   → リアルタイムで「収集件数」が更新される
   → プレビューエリアにCSV形式のデータが表示される

3. 必要に応じて「収集停止」ボタンで監視を停止
```

#### 📊 CSV出力
```
1. 「CSVダウンロード」ボタンをクリック
2. ファイルが自動ダウンロードされる
   ファイル名例: network_images_2025-09-19_14-30-45.csv
```

## 📄 CSV出力形式

### 基本フォーマット

```csv
"ファイル名","URL"
"image1.jpg","https://example.com/images/image1.jpg"
"logo.png","https://example.com/assets/logo.png"
"icon.svg","https://example.com/icons/icon.svg"
```

### CSVフォーマットの詳細仕様

#### ✅ エンコーディング
- **文字エンコーディング**: UTF-8 with BOM
- **改行コード**: LF (`\n`)
- **区切り文字**: カンマ (`,`)

#### ✅ エスケープ処理
- **ダブルクォート**: すべての値を `"` で囲む
- **内部のクォート**: `"` → `""` に変換（RFC 4180準拠）
- **NULL値**: 空文字列として処理

#### ✅ ヘッダー設定
| 列名 | 内容 | 例 |
|------|------|-----|
| ファイル名 | URLのpathから抽出されたファイル名 | `image.jpg`, `logo.png` |
| URL | 完全なリクエストURL | `https://example.com/path/image.jpg` |

#### ✅ ファイル名規則
```
network_images_YYYY-MM-DD_HH-mm-ss.csv
```
- `YYYY-MM-DD`: 年-月-日
- `HH-mm-ss`: 時-分-秒
- タイムゾーン: UTC

### カスタマイズ可能な設定

CSVフォーマットは `panel.js` の関数で制御されており、以下の設定が可能です：

```javascript
// ヘッダーをカスタマイズ
const csv = generateCSV(rows, {
  headers: ["ファイル名", "URL"],           // 日本語ヘッダー
  includeHeaders: true                    // ヘッダー行を含める
});

// 英語ヘッダーの例
const csvEnglish = generateCSV(rows, {
  headers: ["Filename", "Request URL"],
  includeHeaders: true
});

// ヘッダーなしの例
const csvNoHeader = generateCSV(rows, {
  includeHeaders: false
});
```

## 🔧 対応画像形式

以下の画像形式が自動検出されます：

| 形式 | 拡張子 | 説明 |
|------|--------|------|
| PNG | `.png` | 可逆圧縮画像 |
| JPEG | `.jpg`, `.jpeg` | 非可逆圧縮画像 |
| GIF | `.gif` | アニメーション対応 |
| WebP | `.webp` | Google開発の高効率形式 |
| SVG | `.svg` | ベクター画像 |
| AVIF | `.avif` | 次世代高効率形式 |
| BMP | `.bmp` | Windows標準ビットマップ |
| ICO | `.ico` | アイコンファイル |

### 画像検出ロジック

```javascript
// URLのpathnameから拡張子を抽出
const pathname = url.pathname.toLowerCase();
const ext = pathname.slice(pathname.lastIndexOf("."));

// 対象拡張子セットでチェック
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".bmp", ".ico"]);
```

## 🛠️ 技術仕様

### アーキテクチャ

```
Chrome Extension (Manifest V3)
├─ DevTools Extension
│  ├─ Panel UI (HTML/CSS/JS)
│  └─ Network Monitoring
├─ Background Service Worker
└─ Local Storage (Settings)
```

### ファイル構成

```
net2sheet/
├─ manifest.json           # 拡張機能設定
├─ devtools-page.html      # DevToolsエントリーポイント
├─ devtools-page.js        # パネル作成スクリプト
├─ panel.html              # パネルUI
├─ panel.js                # 主要ロジック
├─ service_worker.js       # バックグラウンド処理
└─ icon*.png              # 拡張機能アイコン
```

### 主要API使用箇所

| API | 用途 |
|-----|------|
| `chrome.devtools.network.onRequestFinished` | ネットワークリクエスト監視 |
| `chrome.devtools.panels.create` | DevToolsパネル作成 |
| `chrome.storage.local` | 設定の永続化 |
| `Blob API` | CSVファイル生成 |
| `URL.createObjectURL` | ダウンロード処理 |

## 🔄 GAS連携（オプション）

Google Apps Scriptとの連携により、収集したデータを直接スプレッドシートに送信できます。

### GAS WebApp設定手順

1. **Google Apps Scriptプロジェクト作成**
2. **WebAppコードをデプロイ**（詳細は `PLAN.md` を参照）
3. **WebApp URLを拡張機能に設定**
4. **「スプレッドシートへ送信」ボタンで送信**

### 送信データ形式

```json
{
  "rows": [
    ["image1.jpg", "https://example.com/images/image1.jpg"],
    ["logo.png", "https://example.com/assets/logo.png"]
  ]
}
```

## 🔍 CSV Image Checker

Net2Sheetで生成されたCSVファイルの内容を視覚的に確認・編集できるWebツールです。

### 概要

`csv-checker.html` は、Net2Sheet拡張機能で生成されたCSVファイルをブラウザで開いて、含まれる画像を一覧表示し、編集・再出力できるスタンドアロンツールです。

### 主な機能

- 📁 **CSVファイル読み込み**: Net2Sheet形式のCSVファイルをドラッグ&ドロップまたはファイル選択で読み込み
- 🖼️ **画像プレビュー**: URLから画像を自動読み込みして視覚的に確認
- ✏️ **ファイル名編集**: 各画像のファイル名をインラインで編集可能
- 🚫 **除外機能**: 不要な画像をチェックボックスで除外
- 📊 **統計表示**: 総数・有効・除外の件数をリアルタイム表示
- 💾 **修正版CSV出力**: 編集内容を反映した新しいCSVファイルをダウンロード

### 使用方法

1. **ツールを開く**: `csv-checker.html` をブラウザで開く
2. **CSVファイル選択**: 「CSVファイルを選択」ボタンからNet2Sheetで生成されたCSVファイルを選択
3. **画像確認**: 自動的に画像一覧が表示される
4. **編集作業**: 
   - 各画像のファイル名を必要に応じて編集
   - 不要な画像は「この画像を除外する」をチェック
5. **出力**: 「修正版CSVをダウンロード」ボタンで編集済みCSVを保存

### 対応CSV形式

Net2Sheet拡張機能が出力する以下の形式に対応：

```csv
"ファイル名","URL"
"image1.jpg","https://example.com/images/image1.jpg"
"logo.png","https://example.com/assets/logo.png"
```

### 技術仕様

- **ファイル形式**: スタンドアロンHTML（外部依存なし）
- **対応ブラウザ**: Chrome, Firefox, Safari, Edge（ES6対応）
- **CSVパース**: RFC 4180準拠のクォート処理
- **画像読み込み**: CORS制約のないパブリック画像URL
- **出力形式**: UTF-8 BOM付きCSV

### 制限事項

- **CORS制約**: 一部の画像サーバーではCORSポリシーにより画像が表示されない場合があります
- **プライベート画像**: 認証が必要な画像URLは表示できません
- **大量データ**: 1000件を超える画像データではパフォーマンスが低下する可能性があります

---

**Net2Sheet** - Chromeの開発者向けネットワーク監視・画像収集ツール
