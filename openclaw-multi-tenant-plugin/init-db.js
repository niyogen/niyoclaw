import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
async function run() {
    console.log("Initializing database schema on AWS RDS...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`
      CREATE TABLE IF NOT EXISTS BUSINESS_CLIENT (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          stripe_customer_id VARCHAR(255) UNIQUE,
          available_tokens INT NOT NULL DEFAULT 0,
          recStatus INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS TENANT_PROFILE (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          business_client_id UUID NOT NULL REFERENCES BUSINESS_CLIENT(id),
          tenant_name VARCHAR(255) NOT NULL,
          system_prompt TEXT NOT NULL,
          enabled_tools JSONB NOT NULL DEFAULT '[]',
          recStatus INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS WHATSAPP_NUMBER (
          phone_number_id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
          tenant_profile_id UUID NOT NULL REFERENCES TENANT_PROFILE(id),
          encrypted_access_token TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS END_USER (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_profile_id UUID NOT NULL REFERENCES TENANT_PROFILE(id),
          phone_number VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          first_interacted_at TIMESTAMP NOT NULL DEFAULT now(),
          last_interacted_at TIMESTAMP NOT NULL DEFAULT now(),
          UNIQUE(tenant_profile_id, phone_number)
      );

      CREATE TABLE IF NOT EXISTS TOKEN_USAGE_LOG (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_profile_id UUID NOT NULL REFERENCES TENANT_PROFILE(id),
          end_user_id UUID NOT NULL REFERENCES END_USER(id),
          input_tokens INT NOT NULL DEFAULT 0,
          output_tokens INT NOT NULL DEFAULT 0,
          total_cost_deducted INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
        // Insert Dummy Data
        const bcRes = await client.query(`
      INSERT INTO BUSINESS_CLIENT (email, available_tokens) 
      VALUES ('admin@dealmate.com', 100000)
      ON CONFLICT (email) DO UPDATE SET available_tokens = 100000
      RETURNING id;
    `);
        const bcId = bcRes.rows[0].id;
        const tenantRes = await client.query(`
      INSERT INTO TENANT_PROFILE (business_client_id, tenant_name, system_prompt)
      VALUES ($1, 'DealMate', 'You are Dealmate, a conversational grocery assistant...')
      RETURNING id;
    `, [bcId]);
        const tenantId = tenantRes.rows[0].id;
        await client.query(`
      INSERT INTO WHATSAPP_NUMBER (phone_number_id, tenant_profile_id)
      VALUES ('1086592664537682', $1)
      ON CONFLICT (phone_number_id) DO NOTHING;
    `, [tenantId]);
        await client.query('COMMIT');
        console.log("Schema initialized successfully and Dummy Tenant injected.");
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error("Database initialization failed", err);
    }
    finally {
        client.release();
        pool.end();
    }
}
run();
//# sourceMappingURL=init-db.js.map