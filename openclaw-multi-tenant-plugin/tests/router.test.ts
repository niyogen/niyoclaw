import { test } from 'node:test';
import assert from 'node:assert';
import { handleIncomingWebhook } from '../src/entrypoint/whatsapp-webhook';
import { MetaWebhookPayload } from '../src/entrypoint/meta-webhook.interfaces';

test('Webhook successfully routes DealMate phone number', () => {
  const mockPayload: MetaWebhookPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: "abc",
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "111",
            phone_number_id: "1234567890" // DealMate ID
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

  const result = handleIncomingWebhook(mockPayload);
  assert.strictEqual(result?.tenant, 'dealmate');
  assert.strictEqual(result?.endUserPhone, '19876543210');
});

test('Webhook successfully routes TourGuardian phone number', () => {
  const mockPayload: MetaWebhookPayload = {
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

  const result = handleIncomingWebhook(mockPayload);
  assert.strictEqual(result?.tenant, 'tourguardian');
});

test('Webhook strictly THROWS ERROR on unknown hacker/spam phone number', () => {
  const mockPayload: MetaWebhookPayload = {
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

  assert.throws(() => {
    handleIncomingWebhook(mockPayload);
  }, /Routing Error: Unknown phone_number_id 9999999999/);
});
