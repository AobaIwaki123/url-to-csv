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

## 🚨 トラブルシューティング

### よくある問題

#### 問題1: DevToolsに「Net2Sheet」タブが表示されない
**原因**: 拡張機能の読み込みエラー  
**解決方法**:
- `chrome://extensions/` で拡張機能の再読み込み
- ブラウザの再起動
- manifest.jsonの設定確認

#### 問題2: 画像が収集されない
**原因**: キャッシュまたは拡張子未対応  
**解決方法**:
- ハードリロード（Ctrl+Shift+R）を実行
- Networkタブの「Disable cache」を有効化
- 対象拡張子を確認

#### 問題3: CSVダウンロードが失敗する
**原因**: ブラウザ設定またはデータエラー  
**解決方法**:
- ポップアップブロッカーを無効化
- ダウンロード設定を確認
- データが空でないことを確認

## 📊 使用例・活用シーン

### 1. Webサイト監査
```
目的: サイトで使用されている画像リソースの棚卸し
手順: 
1. 監査対象サイトを開く
2. 収集開始後、全ページを巡回
3. CSV出力で画像一覧を取得
4. 最適化が必要な画像を特定
```

### 2. 競合調査
```
目的: 競合サイトの画像リソース分析
手順:
1. 競合サイトで収集開始
2. 主要ページを閲覧
3. 使用されている画像URLを収集
4. デザイン参考やCDN使用状況を分析
```

### 3. パフォーマンス分析
```
目的: 画像読み込みパフォーマンスの改善
手順:
1. DevToolsのNetworkタブと併用
2. 画像リクエストを収集
3. サイズの大きい画像や多重読み込みを特定
4. 最適化候補をCSVで管理
```

## 🔒 プライバシー・セキュリティ

- **データ収集**: ローカル環境でのみ動作、外部送信なし（GAS連携除く）
- **権限**: DevTools API、ローカルストレージのみ使用
- **機密情報**: URLが記録されるため、機密性の高いサイトでは注意

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/new-feature`)
3. 変更をコミット (`git commit -am 'Add new feature'`)
4. ブランチにプッシュ (`git push origin feature/new-feature`)
5. プルリクエストを作成

## 📞 サポート

- **Issue報告**: [GitHub Issues](https://github.com/your-username/net2sheet/issues)
- **機能要望**: [GitHub Discussions](https://github.com/your-username/net2sheet/discussions)

---

**Net2Sheet** - Chromeの開発者向けネットワーク監視・画像収集ツール
