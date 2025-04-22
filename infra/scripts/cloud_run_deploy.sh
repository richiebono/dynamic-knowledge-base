#!/bin/bash

# Load .env file
if [ -f "../../.env" ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' ../../.env | xargs)
else
  echo "Error: .env file not found."
  exit 1
fi

# Define variables
IMAGE_NAME="gcr.io/$GCP_PROJECT_ID/$SERVICE_NAME"

# Build and push Docker image using Cloud Build
echo "Building and pushing Docker image with Cloud Build..."
gcloud builds submit \
  --tag "$IMAGE_NAME" \
  --project "$GCP_PROJECT_ID" || exit 1

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_NAME" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DATABASE" || exit 1

echo "Cloud Run service '$SERVICE_NAME' deployed successfully."
