/**
 * Core Routing Engine
 * Determines which Tenant (DealMate or TourGuardian) should handle an incoming webhook.
 */
// Mock mappings of Phone Number ID to Tenant for MVP
// In Stage 6, this would be updated to pull dynamically from the PostgreSQL DB cache.
const NUMBER_TO_TENANT_CACHE = {
    '1086592664537682': 'dealmate', // Mapped to your live Meta test number!
    '0987654321': 'tourguardian'
};
export function lookupTenant(phoneNumberId) {
    const tenant = NUMBER_TO_TENANT_CACHE[phoneNumberId];
    if (!tenant) {
        throw new Error(`Routing Error: Unknown phone_number_id ${phoneNumberId}`);
    }
    return tenant;
}
//# sourceMappingURL=tenant-routing-engine.js.map