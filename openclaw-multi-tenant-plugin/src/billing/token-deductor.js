import { checkUserBalance, deductTokens, logTokenUsage } from '../database/queries-balances.js';
/**
 * Security & Billing Middleware
 * Intercepts the request BEFORE it hits NVIDIA to ensure the client has funds.
 */
export async function enforceBalanceBeforeInference(tenantProfileId) {
    const balance = await checkUserBalance(tenantProfileId);
    if (balance <= 0) {
        throw new Error("BILLING_ERROR: Insufficient token balance to generate AI response. Please top up via Stripe.");
    }
    return true;
}
/**
 * Deducts the exact token count reported by NVIDIA AFTER inference.
 */
export async function processInferenceCost(tenantProfileId, endUserId, inputTokens, outputTokens) {
    const totalTokens = inputTokens + outputTokens;
    await logTokenUsage(tenantProfileId, endUserId, inputTokens, outputTokens);
    await deductTokens(tenantProfileId, totalTokens);
    console.log(`[BILLING ENGINE] Successfully charged tenant ${totalTokens} tokens for this chat generation.`);
}
//# sourceMappingURL=token-deductor.js.map