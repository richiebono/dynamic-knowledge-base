#!/bin/bash

# This script runs database migrations for the knowledge base application.

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from the .env file
export $(grep -v '^#' .env | xargs)

# Define optional arguments
HOST_ARG=${1:-$POSTGRES_HOST}
PORT_ARG=${2:-$POSTGRES_PORT}
DB_ARG=${3:-$POSTGRES_DATABASE}
USER_ARG=${4:-$POSTGRES_USER}
PASSWORD_ARG=${5:-$POSTGRES_PASSWORD}

# Run the migration using the migration runner and call the "up" function
npx ts-node -e "
    import { Pool } from 'pg';
    import { MigrationRunner } from './src/shared/infrastructure/database/migrationRunner';
    (async () => {
        const pool = new Pool({
            host: '$HOST_ARG',
            port: $PORT_ARG,
            database: '$DB_ARG',
            user: '$USER_ARG',
            password: '$PASSWORD_ARG'
        });
        const runner = new MigrationRunner(pool);
        await runner.up();
        await runner.close();
    })();
"

echo "Database migrations completed successfully."