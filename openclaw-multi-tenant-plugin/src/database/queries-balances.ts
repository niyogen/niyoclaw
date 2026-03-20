import { query } from './postgres-client';

export async function checkUserBalance(tenantProfileId: string): Promise<number> {
  // Production SQL resolving Tenant -> Business Client mapping:
  // const sql = `SELECT bc.available_tokens FROM BUSINESS_CLIENT bc 
  //              JOIN TENANT_PROFILE tp ON bc.id = tp.business_client_id 
  //              WHERE tp.id = $1 AND bc.recStatus = 1`;
  // await query(sql, [tenantProfileId]);
  
  console.log(`[DB QUERY] Checking available balance for Tenant: ${tenantProfileId}`);
  
  // Returning mock balance of 1000 tokens for testing
  return 1000;
}

export async function deductTokens(tenantProfileId: string, tokensUsed: number): Promise<void> {
  console.log(`[DB QUERY] Deducting -${tokensUsed} tokens from Tenant: ${tenantProfileId}`);
  
  // Atomic deduction:
  // const sql = `UPDATE BUSINESS_CLIENT SET available_tokens = available_tokens - $1 
  //              FROM TENANT_PROFILE tp 
  //              WHERE BUSINESS_CLIENT.id = tp.business_client_id AND tp.id = $2`;
  // await query(sql, [tokensUsed, tenantProfileId]);
}

export async function logTokenUsage(tenantProfileId: string, endUserId: string, input: number, output: number) {
  console.log(`[DB QUERY] Logging Usage Metrics -> Input: ${input}, Output: ${output} for Tenant: ${tenantProfileId}`);
  
  // const sql = `INSERT INTO TOKEN_USAGE_LOG (tenant_profile_id, end_user_id, input_tokens, output_tokens, total_cost_deducted)
  //              VALUES ($1, $2, $3, $4, $5)`;
  // await query(sql, [tenantProfileId, endUserId, input, output, input + output]);
}
