import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/**
 * Executes a query securely against the live PostgreSQL database.
 */
export async function query(sql: string, params?: any[]) {
  console.log(`\n[DATABASE] Executing SQL: ${sql.trim().split('\n')[0]}...`);
  return await pool.query(sql, params);
}
