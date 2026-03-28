/**
 * Security & Billing Middleware
 * Intercepts the request BEFORE it hits NVIDIA to ensure the client has funds.
 */
export declare function enforceBalanceBeforeInference(tenantProfileId: string): Promise<boolean>;
/**
 * Deducts the exact token count reported by NVIDIA AFTER inference.
 */
export declare function processInferenceCost(tenantProfileId: string, endUserId: string, inputTokens: number, outputTokens: number): Promise<void>;
//# sourceMappingURL=token-deductor.d.ts.map