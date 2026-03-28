/**
 * Core Routing Engine
 * Determines which Tenant (DealMate or TourGuardian) should handle an incoming webhook.
 */
export type TenantId = 'dealmate' | 'tourguardian';
export declare function lookupTenant(phoneNumberId: string): TenantId;
//# sourceMappingURL=tenant-routing-engine.d.ts.map