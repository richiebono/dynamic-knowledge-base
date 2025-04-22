#!/bin/bash

# Load .env file
if [ -f "../../.env" ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' ../../.env | xargs)
else
  echo "Error: .env file not found."
  exit 1
fi

# Set the project
echo "Setting the GCP project..."
gcloud config set project "$GCP_PROJECT_ID" || exit 1

# Create the Cloud SQL instance
echo "Creating the Cloud SQL instance..."
gcloud sql instances create "${SERVICE_NAME}-sql" \
  --database-version="$DATABASE_VERSION" \
  --tier="$TIER" \
  --region="$REGION" \
  --storage-type="SSD" \
  --storage-size=10 \
  --availability-type="ZONAL" || exit 1

# Set the root password
echo "Setting the root password for the instance..."
gcloud sql users set-password postgres \
  --instance="${SERVICE_NAME}-sql" \
  --password="$POSTGRES_PASSWORD" || exit 1

# Create the database
echo "Creating the database '$POSTGRES_DATABASE'..."
gcloud sql databases create "$POSTGRES_DATABASE" \
  --instance="${SERVICE_NAME}-sql" || exit 1

# Output connection details
echo "Cloud SQL instance '${SERVICE_NAME}-sql' created successfully."
echo "Database '$POSTGRES_DATABASE' created successfully."
echo "Connect using the following details:"
echo "Instance connection name: $(gcloud sql instances describe ${SERVICE_NAME}-sql --format='value(connectionName)')"
