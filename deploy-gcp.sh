#!/bin/bash
set -euo pipefail

PROJECT_ID="$(gcloud config get-value project)"
REGION="${REGION:-asia-south1}"
SERVICE_NAME="debapras-website"
AR_REPO="debapras-website"
TAG="${TAG:-manual}"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/web:${TAG}"

echo "Project ${PROJECT_ID}, region ${REGION}"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com

gcloud artifacts repositories describe "${AR_REPO}" --location="${REGION}" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "${AR_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="debapras-website images"

echo "Building container..."
gcloud builds submit . \
  --config deploy/github/cloudbuild.yaml \
  --substitutions="_TAG=${TAG},_REGION=${REGION},_AR_REPO=${AR_REPO}"

echo "Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --timeout 60 \
  --min-instances 0 \
  --max-instances 2
