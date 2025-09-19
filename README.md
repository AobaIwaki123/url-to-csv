# 画像URLスクレイパー

![URL to CSV Toolkit](https://aobaiwaki123.github.io/url-to-csv/url-to-csv.png "URL to CSV Toolkit")

## 📋 概要

画像URL収集のための**包括的なツールキット**。3つの補完的なツールで様々な画像抽出ニーズに対応します。

### 🔧 3つのツール構成

1. **Net2Sheet** (Chrome拡張機能): DevToolsを用いたリアルタイムネットワーク監視による画像収集機能を持つChrome拡張機能
2. **[CSV Checker](https://aobaiwaki123.github.io/url-to-csv/csv-checker.html)**: CSVファイルの視覚的確認・編集ツール
3. **[URL to CSV](https://aobaiwaki123.github.io/url-to-csv/url-to-csv.html)**: Web上でウェブサイトのURLから画像URLを抽出するツール

## Net2Sheet (Chrome拡張機能)

Net2SheetはWeb開発者やコンテンツ管理者向けの拡張機能で、ブラウザのネットワーク通信を監視して画像リソースの情報を効率的に収集・分析できます。

### ✨ 主な機能

- 📁 **多様な画像形式対応**: PNG, JPEG, GIF, WebP, SVG, AVIF, BMP, ICO
- 📊 **CSV出力**: 収集したデータを重複排除してCSV形式でダウンロード
- 🎯 **ユーザーフレンドリー**: 直感的なDevToolsパネルUI

## 🚀 Chrome拡張機能のインストール方法

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

## 📄 CSV出力形式

### 基本フォーマット

```csv
"name","url"
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
| name | URLのpathから抽出されたファイル名 | `image.jpg`, `logo.png` |
| url | 完全なリクエストURL | `https://example.com/path/image.jpg` |

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

## 🌐 URL to CSV (Web画像抽出ツール)

ブラウザ拡張機能を使わずにWebページから画像URLを直接抽出できる**スタンドアロンWebアプリケーション**です。

### 主な機能

- 🔗 **URLのみから画像を抽出**: 指定したWebページから画像を自動検出・抽出
- 💾 **CSV出力**: Net2Sheet形式と完全互換のCSVファイル生成

### 使用方法

1. **[URL to CSV](https://aobaiwaki123.github.io/url-to-csv/url-to-csv.html)** をブラウザで開く
2. **抽出方法を選択**:
   - URLのみから抽出
3. **画像抽出実行**: 該当する抽出ボタンをクリック
4. **結果確認**: 抽出された画像一覧をプレビュー
5. **CSV出力**: 「CSVダウンロード」ボタンでファイル保存

### 対応環境

- **ブラウザ**: Chrome, Firefox, Safari, Edge (ES6対応必須)
- **CORS制限**: 一部サイトは直接アクセス不可（HTML手動入力で対応）
- **認証**: パブリックページのみ対応（ログイン不要なページ）

---

## 🔍 CSV Image Checker

Net2SheetやURL to CSVで生成されたCSVファイルの内容を視覚的に確認・編集できるWebツールです。

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
"name","url"
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

## 🔄 ツール間連携・統合ワークフロー

### CSV形式互換性

全ツールで統一されたCSVフォーマットを採用：

```csv
"ファイル名","URL"
"image1.jpg","https://example.com/images/image1.jpg"
"logo.png","https://cdn.example.com/assets/logo.png"
```

**フォーマット仕様:**
- UTF-8 エンコーディング（BOM付き）
- RFC 4180準拠のクォート処理
- 日本語ヘッダー標準、英語ヘッダー対応
- Excel・Googleスプレッドシート対応

---

## 🛠️ 開発者向け情報

### プロジェクト構成

```
url-to-csv/
├─ README.md                    # プロジェクト説明書（このファイル）
├─ header-utils.js              # 共有ユーティリティ関数
├─ csv-checker.html             # CSV画像チェッカー
├─ url-to-csv.html              # URL画像抽出ツール
└─ net2sheet/                   # Chrome拡張機能
   ├─ manifest.json            # 拡張機能設定
   ├─ panel.js                 # メインロジック
   └─ (その他拡張機能ファイル)
```

### 共通技術仕様

- **JavaScript**: ES6+ (async/await, Set, Map, arrow functions)
- **API**: Fetch API, DOM Parser, Blob API
- **UI**: Responsive design, Japanese-first interface
- **互換性**: Chrome, Firefox, Safari, Edge

### 拡張・カスタマイズ

各ツールは独立したファイルとして動作するため、個別のカスタマイズが可能です：

- **画像形式追加**: `IMAGE_EXTS` セットに新しい拡張子を追加
- **CSVフォーマット変更**: `generateCSV` 関数のオプション調整
- **UI言語変更**: HTML内のテキストを多言語化
- **新機能追加**: 既存のユーティリティ関数を活用

---

**画像URLスクレイパー** - 包括的な画像URL収集・管理ツールキット

*Web開発者、コンテンツ管理者、デジタルアセット担当者のための統合ソリューション*
