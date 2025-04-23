const { MigrationRunner } = require('../../dist/shared/infrastructure/database/migrationRunner');
const { Pool } = require('pg');

(async () => {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  });
  const runner = new MigrationRunner(pool);
  await runner.up();
  await runner.close();
})();