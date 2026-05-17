import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let pool;

try {
  if (connectionString) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Necessary for serverless connections to Neon / Vercel Postgres in the cloud
      }
    });
  } else {
    // Local fallback connecting to your local PostgreSQL server
    pool = new Pool({
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || 'horizontal_learning'
    });
  }
} catch (error) {
  console.error("PostgreSQL Pool initialization failed:", error);
}

export default pool;
