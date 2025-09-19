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

## 🔄 GAS連携（オプション） / Cloud Run 連携

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

---

**Net2Sheet** - Chromeの開発者向けネットワーク監視・画像収集ツール

---

## ☁️ Cloud Run バックエンド + Cloud Run Job（スプレッドシート連携）

Chrome拡張で生成したCSVをCloud Runサービスへ送信し、GCSへ保存後、Cloud Run Jobでスプレッドシートに追記します。認証は `IMPLEMENTATION-PLAN.md` のJWT方式に準拠します。

### 前提
- gcloud CLI / Docker が利用可能
- プロジェクトに対し以下のAPIが有効
  - Cloud Run, Cloud Build, Cloud Storage, Google Sheets API

### デプロイ手順

#### **方法1: 自動セットアップ（推奨）**

```bash
cd backend

# 1. 対話式セットアップで環境変数を設定
./setup.sh

# 2. Google Cloud APIの有効化
gcloud services enable run.googleapis.com cloudbuild.googleapis.com storage.googleapis.com sheets.googleapis.com

# 3. Cloud Storageバケット作成
gsutil mb -l ${REGION} gs://${BUCKET}  # BUCKETは.envで設定された値

# 4. デプロイ実行
./deploy.sh
```

#### **方法2: 手動設定**

```bash
cd backend

# 1. 環境変数ファイル作成
cp example.env .env
# .envファイルを編集して実際の値を設定

# 2. 以下は上記の方法1と同じ
gcloud services enable run.googleapis.com cloudbuild.googleapis.com storage.googleapis.com sheets.googleapis.com
gsutil mb -l ${REGION} gs://${BUCKET}
./deploy.sh
```

#### **環境変数の説明**

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `PROJECT_ID` | Google Cloud プロジェクトID | `my-project-123` |
| `REGION` | デプロイ先リージョン | `us-central1` |
| `BUCKET` | Cloud Storage バケット名 | `net2sheet-uploads-20250119` |
| `SHEET_ID` | Google Sheets の ID | `1BxiMVs0XRA5nFMd...` |
| `SHEET_RANGE` | 書き込み先のセル範囲 | `Sheet1!A1` |
| `JWT_SECRET` | JWT認証用の秘密鍵 | `your-secret-key` |

デプロイ後、Cloud RunサービスのURLが払い出されます（例: `https://net2sheet-upload-xxxxx-uc.a.run.app`）。

### 拡張からの送信例

```javascript
// token は IMPLEMENTATION-PLAN.md のフローで取得したJWT
await fetch('https://<SERVICE_URL>/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'text/csv',
  },
  body: csvString, // 生成したCSV文字列
});
```

サービスはCSVを `gs://${BUCKET}/uploads/` に保存し、その後Cloud Run Jobを起動してGoogle Sheetsへ追記します。
