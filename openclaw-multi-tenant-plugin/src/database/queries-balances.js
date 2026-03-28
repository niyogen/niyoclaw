import { query } from './postgres-client.js';
export async function checkUserBalance(phoneNumberId) {
    const sql = `
    SELECT bc.available_tokens 
    FROM BUSINESS_CLIENT bc 
    JOIN TENANT_PROFILE tp ON bc.id = tp.business_client_id 
    JOIN WHATSAPP_NUMBER wn ON tp.id = wn.tenant_profile_id
    WHERE wn.phone_number_id = $1 AND bc.recStatus = 1
  `;
    const result = await query(sql, [phoneNumberId]);
    return result.rows.length ? result.rows[0].available_tokens : 0;
}
export async function deductTokens(phoneNumberId, tokensUsed) {
    const sql = `
    UPDATE BUSINESS_CLIENT 
    SET available_tokens = available_tokens - $1 
    FROM TENANT_PROFILE tp, WHATSAPP_NUMBER wn
    WHERE BUSINESS_CLIENT.id = tp.business_client_id 
      AND tp.id = wn.tenant_profile_id 
      AND wn.phone_number_id = $2
  `;
    await query(sql, [tokensUsed, phoneNumberId]);
}
export async function logTokenUsage(phoneNumberId, endUserPhone, input, output) {
    // First, explicitly check if END_USER exists, if not create them to maintain referential integrity.
    const userSql = `
    INSERT INTO END_USER (tenant_profile_id, phone_number)
    SELECT tp.id, $2
    FROM TENANT_PROFILE tp
    JOIN WHATSAPP_NUMBER wn ON tp.id = wn.tenant_profile_id
    WHERE wn.phone_number_id = $1
    ON CONFLICT (tenant_profile_id, phone_number) DO NOTHING
    RETURNING id;
  `;
    let userResult = await query(userSql, [phoneNumberId, endUserPhone]);
    if (userResult.rows.length === 0) {
        const fetchUser = `
        SELECT eu.id FROM END_USER eu
        JOIN TENANT_PROFILE tp ON eu.tenant_profile_id = tp.id
        JOIN WHATSAPP_NUMBER wn ON tp.id = wn.tenant_profile_id
        WHERE wn.phone_number_id = $1 AND eu.phone_number = $2
     `;
        userResult = await query(fetchUser, [phoneNumberId, endUserPhone]);
    }
    if (userResult.rows.length > 0) {
        const endUserId = userResult.rows[0].id;
        const logSql = `
        INSERT INTO TOKEN_USAGE_LOG (tenant_profile_id, end_user_id, input_tokens, output_tokens, total_cost_deducted)
        SELECT tp.id, $2, $3, $4, $5
        FROM TENANT_PROFILE tp
        JOIN WHATSAPP_NUMBER wn ON tp.id = wn.tenant_profile_id
        WHERE wn.phone_number_id = $1
      `;
        await query(logSql, [phoneNumberId, endUserId, input, output, input + output]);
    }
}
//# sourceMappingURL=queries-balances.js.map