#!/usr/bin/env bash
set -euo pipefail

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "⚠️  .env file not found. Please copy example.env to .env and configure your values."
  echo "   cp example.env .env"
  echo "   # Edit .env with your actual values"
  exit 1
fi

# Validate required environment variables
REQUIRED_VARS=(
  "PROJECT_ID"
  "REGION" 
  "BUCKET"
  "SHEET_ID"
  "SHEET_RANGE"
  "JOB_NAME"
  "SERVICE_NAME"
  "JWT_SECRET"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Error: Required environment variable $var is not set"
    echo "   Please check your .env file"
    exit 1
  fi
done

echo "✅ All required environment variables are set"
echo "🚀 Starting deployment for project: ${PROJECT_ID}"

gcloud config set project "${PROJECT_ID}"

# Build images (using Docker CLI for flexible contexts)
SERVICE_IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
JOB_IMAGE="gcr.io/${PROJECT_ID}/${JOB_NAME}:latest"

# Build from project root with correct contexts
docker build -f service/Dockerfile -t "$SERVICE_IMAGE" .
docker build -f job/Dockerfile -t "$JOB_IMAGE" .
gcloud auth configure-docker -q
docker push "$SERVICE_IMAGE"
docker push "$JOB_IMAGE"

# Create custom service account for Cloud Run Job (with proper permissions)
SERVICE_ACCOUNT_NAME="net2sheet-job-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts describe "${SERVICE_ACCOUNT_EMAIL}" >/dev/null 2>&1 || {
  echo "Creating service account: ${SERVICE_ACCOUNT_NAME}"
  gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
    --display-name="Net2Sheet Cloud Run Job Service Account" \
    --description="Service account for Cloud Run Job to access GCS and Google Sheets"
}

# Grant necessary permissions to the service account
echo "Granting permissions to ${SERVICE_ACCOUNT_EMAIL}"

# Cloud Storage permissions (read access to bucket)
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectViewer"

# Google Sheets API permissions (requires manual setup - see documentation)
echo "⚠️  MANUAL STEP REQUIRED:"
echo "   1. Go to Google Cloud Console > IAM & Admin > Service Accounts"
echo "   2. Find ${SERVICE_ACCOUNT_EMAIL}"
echo "   3. Click 'Keys' tab and create a JSON key"
echo "   4. Share your Google Sheet with ${SERVICE_ACCOUNT_EMAIL} (Editor permission)"
echo "   OR use Domain-wide Delegation for G Workspace"

# Deploy Cloud Run Job with custom service account
gcloud run jobs describe "${JOB_NAME}" --region "${REGION}" >/dev/null 2>&1 || {
  gcloud run jobs create "${JOB_NAME}" \
    --image "$JOB_IMAGE" \
    --region "${REGION}" \
    --service-account="${SERVICE_ACCOUNT_EMAIL}" \
    --set-env-vars GCS_BUCKET="${BUCKET}",SHEET_ID="${SHEET_ID}",SHEET_RANGE="${SHEET_RANGE}"
}
gcloud run jobs update "${JOB_NAME}" \
  --image "$JOB_IMAGE" \
  --region "${REGION}" \
  --service-account="${SERVICE_ACCOUNT_EMAIL}" \
  --set-env-vars GCS_BUCKET="${BUCKET}",SHEET_ID="${SHEET_ID}",SHEET_RANGE="${SHEET_RANGE}"

# Create service account for Cloud Run Service (for triggering jobs)
SERVICE_SERVICE_ACCOUNT_NAME="net2sheet-service-sa"
SERVICE_SERVICE_ACCOUNT_EMAIL="${SERVICE_SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts describe "${SERVICE_SERVICE_ACCOUNT_EMAIL}" >/dev/null 2>&1 || {
  echo "Creating service account: ${SERVICE_SERVICE_ACCOUNT_NAME}"
  gcloud iam service-accounts create "${SERVICE_SERVICE_ACCOUNT_NAME}" \
    --display-name="Net2Sheet Cloud Run Service Account" \
    --description="Service account for Cloud Run Service to write GCS and trigger jobs"
}

# Grant permissions for Cloud Run Service
echo "Granting permissions to ${SERVICE_SERVICE_ACCOUNT_EMAIL}"

# Cloud Storage write permissions (for uploading CSV files)
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectCreator"

# Cloud Run jobs execute permission (specific permission to run jobs)
# Note: Using cloud-platform scope in service code, so need broader permission
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.developer"

# Alternative: More restrictive but requires code changes to use run.invoker role
# gcloud run jobs add-iam-policy-binding "${JOB_NAME}" \
#   --region="${REGION}" \
#   --member="serviceAccount:${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
#   --role="roles/run.invoker"

# Deploy Cloud Run Service with custom service account
gcloud run deploy "${SERVICE_NAME}" \
  --image "$SERVICE_IMAGE" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --service-account="${SERVICE_SERVICE_ACCOUNT_EMAIL}" \
  --set-env-vars JWT_SECRET="${JWT_SECRET}",GCS_BUCKET="${BUCKET}",JOB_LOCATION="${REGION}",JOB_NAME="${JOB_NAME}",ALLOWED_ORIGINS="chrome-extension://*"

echo "Deployment complete."


