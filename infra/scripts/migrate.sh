#!/bin/bash

# This script runs database migrations for the knowledge base application.

# Exit immediately if a command exits with a non-zero status
set -e

# Define the database connection parameters
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="knowledge_base"
DB_USER="your_username"
DB_PASSWORD="your_password"

# Run the migration using the migration runner
npx ts-node src/shared/infrastructure/database/migrationRunner.ts \
  --host $DB_HOST \
  --port $DB_PORT \
  --database $DB_NAME \
  --user $DB_USER \
  --password $DB_PASSWORD

echo "Database migrations completed successfully."