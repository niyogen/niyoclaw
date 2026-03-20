/**
 * PostgreSQL Client Setup
 * We use a connection pool to interact with the database.
 * NOTE: For MVP testing, this throws console logs and mock responses until 'pg' is fully wired.
 */

// import { Pool } from 'pg';
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query(sql: string, params: any[]) {
  console.log(`\n[DATABASE] Executing SQL:`);
  console.log(sql);
  console.log(`Params:`, params);
  
  // Mock success response
  return { rows: [] };
}
