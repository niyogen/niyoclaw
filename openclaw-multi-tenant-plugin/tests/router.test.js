import { test } from 'node:test';
import assert from 'node:assert';
import { handleIncomingWebhook } from '../src/entrypoint/whatsapp-webhook.js';
test('Webhook successfully routes DealMate phone number', async () => {
    const mockPayload = {
        object: 'whatsapp_business_account',
        entry: [{
                id: "abc",
                changes: [{
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "111",
                                phone_number_id: "1086592664537682" // DealMate Live ID
                            },
                            messages: [{
                                    from: "19876543210",
                                    id: "msg1",
                                    timestamp: "123",
                                    type: "text",
                                    text: { body: "Find me organic milk" }
                                }]
                        }
                    }]
            }]
    };
    const result = await handleIncomingWebhook(mockPayload);
    assert.strictEqual(result?.tenant, 'dealmate');
    assert.strictEqual(result?.endUserPhone, '19876543210');
});
test('Webhook successfully routes TourGuardian phone number', async () => {
    const mockPayload = {
        object: 'whatsapp_business_account',
        entry: [{
                id: "abc",
                changes: [{
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "222",
                                phone_number_id: "0987654321" // TourGuardian ID
                            },
                            messages: [{
                                    from: "19876543210",
                                    id: "msg1",
                                    timestamp: "123",
                                    type: "text",
                                    text: { body: "Book a flight to Paris" }
                                }]
                        }
                    }]
            }]
    };
    // Since TourGuardian is not mapped in the live AWS Postgres database, the Billing gate correctly halts it and throws an error!
    await assert.rejects(async () => {
        await handleIncomingWebhook(mockPayload);
    }, /Insufficient token balance/);
});
test('Webhook strictly THROWS ERROR on unknown hacker/spam phone number', async () => {
    const mockPayload = {
        object: 'whatsapp_business_account',
        entry: [{
                id: "abc",
                changes: [{
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "333",
                                phone_number_id: "9999999999" // Unknown Hacker ID
                            },
                            messages: [{
                                    from: "19876543210",
                                    id: "msg1",
                                    timestamp: "123",
                                    type: "text" // Just a raw ping
                                }]
                        }
                    }]
            }]
    };
    await assert.rejects(async () => {
        await handleIncomingWebhook(mockPayload);
    }, /Routing Error: Unknown phone_number_id 9999999999/);
});
//# sourceMappingURL=router.test.js.map