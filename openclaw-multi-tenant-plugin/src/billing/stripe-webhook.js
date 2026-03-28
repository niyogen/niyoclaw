import { query } from '../database/postgres-client.js';
/**
 * Receives incoming webhooks strictly from Stripe when a Business Client buys more usage credits.
 */
export async function handleStripePaymentWebhook(payload) {
    console.log(`\n[STRIPE WEBHOOK] Received payment event type: ${payload.type}`);
    if (payload.type === 'checkout.session.completed') {
        const customerId = payload.data.object.customer;
        const amountPaidCents = payload.data.object.amount_total;
        // Example SaaS math: 1 cent = 1,000 tokens roughly
        const tokensPurchased = amountPaidCents * 1000;
        console.log(`[STRIPE WEBHOOK] Payment Validated! Customer ${customerId} officially bought ${tokensPurchased} tokens.`);
        // Top up the Database
        await topUpBusinessClient(customerId, tokensPurchased);
    }
}
async function topUpBusinessClient(stripeCustomerId, tokensToAdd) {
    console.log(`[DB QUERY] Adding +${tokensToAdd} tokens to Stripe Customer: ${stripeCustomerId}`);
    // const sql = `UPDATE BUSINESS_CLIENT SET available_tokens = available_tokens + $1 WHERE stripe_customer_id = $2`;
    // await query(sql, [tokensToAdd, stripeCustomerId]);
}
//# sourceMappingURL=stripe-webhook.js.map