import { lookupTenant } from '../router/tenant-routing-engine.js';
// Stub Agent mimicking the OpenClaw SDK API surface until the parent library NPM package is explicitly resolved
class Agent {
    config;
    constructor(config) {
        this.config = config;
    }
    async run(input) { return `Message generated dynamically via local LLM agent stub for: "${input}"`; }
}
import { DEALMATE_SYSTEM_PROMPT, DEALMATE_TOOLS_CONFIG } from '../tenants/dealmate/dealmate-persona.js';
import { TOURGUARDIAN_SYSTEM_PROMPT, TOURGUARDIAN_TOOLS_CONFIG } from '../tenants/tourguardian/tourguardian-persona.js';
import { enforceBalanceBeforeInference, processInferenceCost } from '../billing/token-deductor.js';
/**
 * Entrypoint for incoming WhatsApp webhooks.
 * Validates the payload and orchestrates the routing and AI inference securely.
 */
export async function handleIncomingWebhook(payload) {
    // Validate basic structural shape
    if (payload.object !== 'whatsapp_business_account' || !payload.entry || payload.entry.length === 0) {
        throw new Error("Invalid webhook payload structure");
    }
    const entry = payload.entry[0];
    if (!entry || !entry.changes || entry.changes.length === 0) {
        console.log("No changes in this payload. Ignoring.");
        return;
    }
    const change = entry.changes[0];
    if (!change || !change.value)
        return;
    const value = change.value;
    if (!value.messages || value.messages.length === 0) {
        console.log("No messages in this change. Ignoring.");
        return;
    }
    const phoneNumberId = value.metadata.phone_number_id;
    const message = value.messages[0];
    if (!message)
        return;
    const endUserPhone = message.from;
    const userText = message.text?.body;
    console.log(`\n========================================`);
    console.log(`[INCOMING WEBHOOK] Message from End User: ${endUserPhone}`);
    console.log(`[INCOMING WEBHOOK] Target Business Number: ${phoneNumberId}`);
    // 1. ROUTING: Determine the tenant securely
    const tenant = lookupTenant(phoneNumberId);
    const tenantProfileId = phoneNumberId; // The active route serves as the billing ID locally
    console.log(`[ROUTER DECISION] Successfully Routed to Tenant: ${tenant.toUpperCase()}`);
    console.log(`========================================\n`);
    // 2. DISPATCH & INFERENCE (OpenClaw SDK)
    if (!userText) {
        console.log("Ignoring non-text message for MVP constraints.");
        return { status: "ignored_non_text_message" };
    }
    // Pre-Inference Billing Gate (Stage 6 Implementation)
    await enforceBalanceBeforeInference(tenantProfileId);
    let agentConfig;
    if (tenant === 'dealmate') {
        console.log("[DISPATCH NODE] Booting DealMate Persona & injecting Grocery Tools...");
        agentConfig = { systemPrompt: DEALMATE_SYSTEM_PROMPT, tools: DEALMATE_TOOLS_CONFIG };
    }
    else if (tenant === 'tourguardian') {
        console.log("[DISPATCH NODE] Booting TourGuardian Persona & injecting Itinerary Tools...");
        agentConfig = { systemPrompt: TOURGUARDIAN_SYSTEM_PROMPT, tools: TOURGUARDIAN_TOOLS_CONFIG };
    }
    let responseData;
    if (agentConfig) {
        // Intialize OpenClaw Agent
        const aiBrain = new Agent({
            model: 'nvidia-nemo',
            systemPrompt: agentConfig.systemPrompt,
            tools: agentConfig.tools
        });
        // Securely run inference with native context
        const finalReply = await aiBrain.run(userText);
        responseData = { reply: finalReply };
        // CRITICAL: Actually send the generated text back to the physical end user via Meta API!
        if (process.env.META_ACCESS_TOKEN) {
            await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: endUserPhone,
                    type: 'text',
                    text: { body: finalReply }
                })
            });
            console.log(`[OUTBOUND] Successfully sent WhatsApp reply to ${endUserPhone}`);
        }
        // Post-Inference Billing Deduction (Mocking 50 input, 150 output tokens usage)
        await processInferenceCost(tenantProfileId, endUserPhone, 50, 150);
    }
    return { tenant, endUserPhone, message, responseData };
}
//# sourceMappingURL=whatsapp-webhook.js.map