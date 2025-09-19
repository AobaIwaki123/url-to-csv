# Codex Project Guidelines

ガイドラインはCodex CLI用に要約したプロジェクト固有ルールです。仕様追加や大きな変更を行う際は、まずここを確認してください。

## 1. プロジェクト全体像
- 画像URLを収集・確認・編集する3ツール構成: Chrome拡張Net2Sheet、WebアプリURL to CSV、CSV Checker。
- すべてのツールが共通CSV仕様と日本語UIを共有し、ワークフローをシームレスにつなぎます。
- ディレクトリ基点は`url-to-csv/`。各ツールは独立したHTML/JS単体で動作し、`header-utils.js`など一部ユーティリティを共有します。

## 2. コーディング規約 (JavaScript)
- `const`/`let`を使用し、コールバックは原則アロー関数。
- 文字列結合はテンプレートリテラル、配列/オブジェクトアクセスには分割代入を活用。
- CSVエクスポートではRFC 4180準拠のダブルクォートエスケープを行い、UTF-8(BOM)・LF改行。
- 画像拡張子判定は共有セット `IMAGE_EXTS = { .png, .jpg, .jpeg, .gif, .webp, .svg, .avif, .bmp, .ico }` を使い、URL処理は`new URL()`で例外処理付き。
- Blobダウンロードで`URL.revokeObjectURL()`まで実行しリークを防止。
- Chrome拡張APIはガード句で早期リターン、`chrome.storage.local.get`などは分割代入で値を取得。

## 3. UI/UX 共通方針
- 日本語主体のコピー+絵文字でフレンドリーな操作感を維持 (`収集開始`, `CSVダウンロード`などの表現を統一)。
- スタンドアロンHTMLはレスポンシブ前提（モバイル幅で縦積み、デスクトップ幅でグリッド表示）。
- ボタンや通知では即時フィードバックを行い、重大エラーは`alert`(暫定)・軽微な状態変化はUI更新で伝える。
- フォント: ヒラギノ、游ゴシック、メイリオなど日本語対応のサンセリフ体を優先。

## 4. データ取り扱いとワークフロー
- CSV列は`"name","url"`。ファイル名はURLのパス末尾から抽出し、重複は`uniqueBy`などで除去。
- Net2Sheetで収集 → URL to CSVで追加抽出 → CSV Checkerでプレビュー&編集 → 最終CSV出力、が基本フロー。
- GAS(Web Apps)連携時は匿名公開 or 認証付きでCORS設定を明確化し、POSTデータは`{ rows: [[name, url], ...] }`形式。

## 5. テスト・検証
- Net2Sheet: 拡張を再読み込み→DevToolsタブを確認→実際のサイトで複数拡張子/クエリ付きURL/拡張子なし等を検証。
- URL to CSV: 単一URL・複数URL・HTML貼り付けの全入力ルートでCORSエラーや相対URL解決を確認。
- CSV Checker: 大量行(1000件近辺)でのパフォーマンスと再出力CSVの互換性(Excel/スプレッドシート)を確認。
- 重要リリース前はコンソールログを整理し、例外・タイムアウト処理がユーザーに伝わるかチェック。

## 6. パフォーマンス・セキュリティ注意点
- 大規模データ処理はチャンク処理や`requestAnimationFrame`でUIブロックを回避。
- `fetchWithTimeout`でタイムアウト制御し、AbortController後のクリーンアップを忘れない。
- GASや外部エンドポイントへの送信時は機微情報を含むURLを扱う可能性があるため、ログにはトークンを出力しない。
- ローカルまたは`http://localhost`向けURLは無効扱いにするなど、危険URLは早期に弾く。

## 7. 開発時のチェックリスト
- Chrome拡張を編集した場合は`chrome://extensions/`で再読み込み（`manifest.json`を変えたら再インストール）。
- DevToolsパネルが表示されない場合は`manifest.json`の`devtools_page`設定を確認。
- 変更差分は日本語テキストやCSV仕様への影響有無をレビュー。
- コミット前に`README.md`などドキュメントとの整合性を確認し、更新が必要なら同時に行う。

これらを守ることで、Codexでの作業時にもCursor同等のコンテキストが共有されます。
