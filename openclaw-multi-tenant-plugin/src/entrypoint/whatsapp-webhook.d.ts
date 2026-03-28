import type { MetaWebhookPayload } from './meta-webhook.interfaces.js';
/**
 * Entrypoint for incoming WhatsApp webhooks.
 * Validates the payload and orchestrates the routing and AI inference securely.
 */
export declare function handleIncomingWebhook(payload: MetaWebhookPayload): Promise<{
    status: string;
    tenant?: never;
    endUserPhone?: never;
    message?: never;
    responseData?: never;
} | {
    tenant: import("../router/tenant-routing-engine.js").TenantId;
    endUserPhone: string;
    message: import("./meta-webhook.interfaces.js").MetaMessage;
    responseData: {
        reply: string;
    } | undefined;
    status?: never;
} | undefined>;
//# sourceMappingURL=whatsapp-webhook.d.ts.map