#!/bin/bash

# Define paths for configuration and key files
ROOT_DIR=$(pwd)
ENV_FILE="$ROOT_DIR/.env"
SERVICE_ACCOUNT_KEY_FILE="$ROOT_DIR/service-key.json"
SERVICE_ACCOUNT_JSON="$ROOT_DIR/service-config.json"
SERVICE_ACCOUNT_KEY_BASE64_FILE="$ROOT_DIR/service-key.base64"

# Load environment variables from the .env file if it exists
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from the .env file..."
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
else
  echo "The .env file was not found at $ENV_FILE. Continuing without loading local variables."
fi

# Check if required environment variables are set
REQUIRED_VARS=("GCP_PROJECT_ID")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: The environment variable $var is not set."
    exit 1
  fi
done

# Define the service account email
SERVICE_ACCOUNT_EMAIL="$SERVICE_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com"

# Configure the Google Cloud project
echo "Configuring the Google Cloud project..."
gcloud config set project "$GCP_PROJECT_ID" || exit 1

# Check if the service account key file exists
if [ ! -f "$SERVICE_ACCOUNT_KEY_FILE" ]; then
  echo "Service account key file not found. Attempting to generate it..."

  # Check if the service account already exists
  if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" > /dev/null 2>&1; then
    echo "The service account '$SERVICE_ACCOUNT_EMAIL' does not exist. Creating the service account..."

    # Create the service account
    gcloud iam service-accounts create "$SERVICE_NAME" \
      --description="Service account for deployment" \
      --display-name="$SERVICE_NAME" || exit 1
  fi

  # Assign permissions to the service account
  echo "Assigning permissions to the service account..."
  gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/cloudsql.client" || exit 1

  echo "Generating a key for the service account '$SERVICE_ACCOUNT_EMAIL'..."
  
  # Generate the service account key and save it to the key file
  gcloud iam service-accounts keys create "$SERVICE_ACCOUNT_KEY_FILE" \
    --iam-account="$SERVICE_ACCOUNT_EMAIL" || exit 1
fi

# Create a JSON configuration file
echo "Generating a JSON configuration file..."
cat <<EOF > "$SERVICE_ACCOUNT_JSON"
{
  "project_id": "$GCP_PROJECT_ID",
  "service_account_email": "$SERVICE_ACCOUNT_EMAIL",
  "service_account_key_file": "$SERVICE_ACCOUNT_KEY_FILE"
}
EOF

# Encode the service account key in base64 and save it to a .base64 file
echo "Encoding the service account key in base64..."
base64 "$SERVICE_ACCOUNT_KEY_FILE" > "$SERVICE_ACCOUNT_KEY_BASE64_FILE"

echo "JSON configuration file generated at $SERVICE_ACCOUNT_JSON"
echo "Base64-encoded service account key generated at $SERVICE_ACCOUNT_KEY_BASE64_FILE"
