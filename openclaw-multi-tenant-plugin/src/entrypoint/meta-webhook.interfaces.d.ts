/**
 * Strict TypeScript definition for the incoming WhatsApp Cloud API Webhook payload.
 * This ensures the router cannot crash on undefined fields (e.g., when a user sends an image instead of text).
 */
export interface MetaWebhookPayload {
    object: 'whatsapp_business_account';
    entry: MetaEntry[];
}
export interface MetaEntry {
    id: string;
    changes: MetaChange[];
}
export interface MetaChange {
    field: 'messages';
    value: MetaChangeValue;
}
export interface MetaChangeValue {
    messaging_product: 'whatsapp';
    metadata: {
        display_phone_number: string;
        phone_number_id: string;
    };
    contacts?: MetaContact[];
    messages?: MetaMessage[];
}
export interface MetaContact {
    profile: {
        name: string;
    };
    wa_id: string;
}
export interface MetaMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'audio' | 'document' | 'interactive' | 'button' | string;
    text?: {
        body: string;
    };
    image?: {
        id: string;
        mime_type: string;
        sha256: string;
    };
}
//# sourceMappingURL=meta-webhook.interfaces.d.ts.map