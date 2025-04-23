#!/bin/bash

# This script runs database migrations for the knowledge base application.

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from the .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
elif [ -f "../../.env" ]; then
    export $(grep -v '^#' ../../.env | xargs)
else
    echo "Error: .env file not found in current directory or project root."
    exit 1
fi

# Run the migration using the migration runner and call the "up" function
node ./runMigration.js

echo "Database migrations completed successfully."