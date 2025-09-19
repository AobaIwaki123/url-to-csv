# Cloud Run Job 権限管理ガイド

## 🔐 権限管理の場所と設定

### 1. **サービスアカウントの作成と権限付与**
`deploy.sh` スクリプトで以下の2つのサービスアカウントを自動作成：

```bash
# Cloud Run Job用サービスアカウント
SERVICE_ACCOUNT_NAME="net2sheet-job-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Cloud Run Service用サービスアカウント  
SERVICE_SERVICE_ACCOUNT_NAME="net2sheet-service-sa"
SERVICE_SERVICE_ACCOUNT_EMAIL="${SERVICE_SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 2. **Cloud Run Job の権限（自動設定）**

#### Cloud Storage アクセス（読み取りのみ）
```bash
# GCSバケットからCSVファイル読み取り権限
# 操作: bucket.getFiles(), file.download() のみ
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectViewer"
```

**なぜ読み取りのみで十分か**:
- Cloud Run Jobは既存のCSVファイルを読み取るだけ
- ファイルの作成・更新・削除は行わない
- 必要最小権限の原則に準拠

#### Google Sheets アクセス（⚠️ 手動設定必要）
Google Sheets APIアクセスは以下の方法で設定：

**方法1: 個別シート共有（推奨・簡単）**
1. Google Cloud Console > IAM > サービスアカウント
2. `net2sheet-job-sa@PROJECT_ID.iam.gserviceaccount.com` を探す
3. 対象のGoogle Sheetを開く
4. 「共有」ボタンでサービスアカウントのメールアドレスを追加
5. 権限を「編集者」に設定

**方法2: Domain-wide Delegation（組織用）**
1. Google Workspace管理者権限が必要
2. サービスアカウントでDomain-wide Delegationを有効化
3. 管理コンソールでAPIスコープを承認

### 3. **Cloud Run Service の権限（自動設定）**

#### Cloud Storage 書き込み
```bash
# GCSバケットへCSVファイルアップロード権限
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectCreator"
```

#### Cloud Run Job実行（なぜ必要か）
```bash
# Cloud Run Jobの実行権限
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.developer"
```

**なぜCloud Run Job実行権限が必要か**:
1. **Service側での処理フロー**:
   ```
   CSV受信 → GCS保存 → Job実行トリガー
   ```

2. **具体的なAPI呼び出し**:
   ```javascript
   // service/index.js の runJob() 関数
   const url = `https://run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${projectId}/jobs/${JOB_NAME}:run`
   const res = await auth.request({ url, method: "POST" });
   ```

3. **権限が必要な理由**:
   - Cloud Run ServiceがCloud Run Jobs APIを直接呼び出し
   - Jobの新しい実行インスタンスを作成する必要がある
   - 非同期でJobを起動して即座にレスポンスを返す

**セキュリティ考慮**:
- `run.developer` は少し過剰だが、現在のコード（`cloud-platform` スコープ使用）には必要
- より制限的にするには、コード変更が必要（`run.invoker` + 個別Job権限）

## 🚀 デプロイ手順

### 1. 環境変数設定

#### 自動セットアップ（推奨）
```bash
cd backend
./setup.sh  # 対話式で環境変数を設定
```

#### 手動設定
```bash
cp example.env .env
# .envファイルを編集して実際の値を設定
```

#### .envファイルの例
```bash
PROJECT_ID=your-project-id
REGION=us-central1
BUCKET=net2sheet-uploads-12345
SERVICE_NAME=net2sheet-upload
JOB_NAME=csv-to-sheets-job
SHEET_ID=your-google-sheet-id
SHEET_RANGE=Sheet1!A1
JWT_SECRET=your-secret-key
```

### 2. APIの有効化
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com  
gcloud services enable storage.googleapis.com
gcloud services enable sheets.googleapis.com
```

### 3. デプロイ実行
```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

### 4. 手動設定（Google Sheets共有）
デプロイ完了後、コンソールに表示される指示に従って：
1. サービスアカウントのメールアドレスをコピー
2. Google Sheetで共有設定
3. 編集者権限を付与

## 🔍 権限の確認方法

### サービスアカウントの確認
```bash
# 作成されたサービスアカウント一覧
gcloud iam service-accounts list --filter="net2sheet"

# 特定サービスアカウントの権限確認
gcloud projects get-iam-policy ${PROJECT_ID} \
  --flatten="bindings[].members" \
  --filter="bindings.members:*net2sheet*"
```

### Cloud Run設定の確認
```bash
# Job設定確認
gcloud run jobs describe ${JOB_NAME} --region ${REGION}

# Service設定確認  
gcloud run services describe ${SERVICE_NAME} --region ${REGION}
```

## 🛡️ セキュリティのベストプラクティス

### 最小権限の原則
- **Job SA**: Cloud Storage読み取り + Google Sheets書き込みのみ
- **Service SA**: Cloud Storage書き込み + Cloud Run Job実行のみ

### 監査とログ
```bash
# Cloud Run Job実行ログ確認
gcloud logging read "resource.type=cloud_run_job AND resource.labels.job_name=${JOB_NAME}" --limit=50

# サービスアカウント使用ログ確認
gcloud logging read "protoPayload.authenticationInfo.principalEmail:*net2sheet*" --limit=20
```

### 権限の削除（クリーンアップ）
```bash
# サービスアカウント削除
gcloud iam service-accounts delete net2sheet-job-sa@${PROJECT_ID}.iam.gserviceaccount.com
gcloud iam service-accounts delete net2sheet-service-sa@${PROJECT_ID}.iam.gserviceaccount.com

# Cloud Runリソース削除
gcloud run jobs delete ${JOB_NAME} --region ${REGION}
gcloud run services delete ${SERVICE_NAME} --region ${REGION}
```

## ❗ トラブルシューティング

### よくあるエラー

**1. "Permission denied" エラー**
```
403 Forbidden: The caller does not have permission
```
→ Google Sheetの共有設定を確認

**2. "Storage object not found"**
```
404 Not Found: No such object
```
→ Cloud Storage権限とバケット名を確認

**3. "Job execution failed"**
```
Job execution failed with exit code 1
```
→ Cloud Run Job のログを確認：
```bash
gcloud logging read "resource.type=cloud_run_job" --limit=10
```

### 権限テスト用スクリプト

Job権限テスト:
```bash
# GCS読み取りテスト
gsutil ls gs://${BUCKET}/uploads/

# Sheets APIテスト（手動でjob実行）
gcloud run jobs execute ${JOB_NAME} --region ${REGION}
```

Service権限テスト:
```bash
# GCS書き込みテスト  
echo "test" | gsutil cp - gs://${BUCKET}/test.txt

# Job実行テスト
curl -X POST https://${SERVICE_NAME}-xxx.run.app/upload \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: text/csv" \
  -d "name,url
test.jpg,https://example.com/test.jpg"
```
