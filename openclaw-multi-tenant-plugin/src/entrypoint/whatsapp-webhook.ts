import { MetaWebhookPayload } from './meta-webhook.interfaces';
import { lookupTenant } from '../router/tenant-routing-engine';

/**
 * Entrypoint for incoming WhatsApp webhooks.
 * Validates the payload and orchestrates the routing securely.
 */
export function handleIncomingWebhook(payload: MetaWebhookPayload) {
  // Validate basic structural shape
  if (payload.object !== 'whatsapp_business_account' || !payload.entry || payload.entry.length === 0) {
    throw new Error("Invalid webhook payload structure");
  }

  const entry = payload.entry[0];
  if (!entry.changes || entry.changes.length === 0) {
    console.log("No changes in this payload. Ignoring.");
    return;
  }

  const change = entry.changes[0];
  const value = change.value;

  if (!value.messages || value.messages.length === 0) {
    console.log("No messages in this change. Ignoring.");
    return;
  }

  const phoneNumberId = value.metadata.phone_number_id;
  const message = value.messages[0];
  const endUserPhone = message.from;

  console.log(`\n========================================`);
  console.log(`[INCOMING WEBHOOK] Message from End User: ${endUserPhone}`);
  console.log(`[INCOMING WEBHOOK] Target Business Number: ${phoneNumberId}`);

  // 1. ROUTING: Determine the tenant
  const tenant = lookupTenant(phoneNumberId);
  console.log(`[ROUTER DECISION] Successfully Routed to Tenant: ${tenant.toUpperCase()}`);
  console.log(`========================================\n`);

  // 2. DISPATCH
  let responseData;
  if (tenant === 'dealmate') {
    console.log("[DISPATCH NODE] Booting DealMate Persona & injecting Grocery Tools...");
    // Ideally here we pass DEALMATE_SYSTEM_PROMPT into OpenClaw SDK
    responseData = { status: 'Dispatched to DealMate' };
  } else if (tenant === 'tourguardian') {
    console.log("[DISPATCH NODE] Booting TourGuardian Persona & injecting Itinerary Tools...");
    responseData = { status: 'Dispatched to TourGuardian' };
  }
  
  return { tenant, endUserPhone, message, responseData };
}
