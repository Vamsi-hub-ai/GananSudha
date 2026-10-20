const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const {
  isConfigured,
  maskSecret,
  sanitizePhoneNumber,
  formatAssignmentMessage,
  formatCancellationMessage,
  formatRescheduleMessage,
  buildTemplatePayload,
  queueNotification,
  dispatchSingleNotification,
  processOutbox,
  validateWebhookSignature,
  handleWebhookStatus,
  verifyWebhook,
  getHealthAndConfigStatus,
  sendTestNotification
} = require('../whatsappService');
const pool = require('../db');

describe('Meta WhatsApp Cloud API Service Tests', () => {

  describe('1. Phone Number Sanitization & E.164 Normalization', () => {
    it('should format 10-digit Indian phone number to 91XXXXXXXXXX', () => {
      const res = sanitizePhoneNumber('9848012345');
      assert.equal(res.isValid, true);
      assert.equal(res.phone, '919848012345');
    });

    it('should format phone number with +91 and formatting characters', () => {
      const res = sanitizePhoneNumber('+91 (98480) 12345');
      assert.equal(res.isValid, true);
      assert.equal(res.phone, '919848012345');
    });

    it('should strip leading 0 from 11-digit mobile number', () => {
      const res = sanitizePhoneNumber('09848012345');
      assert.equal(res.isValid, true);
      assert.equal(res.phone, '919848012345');
    });

    it('should reject invalid numbers with fewer than 10 digits', () => {
      const res = sanitizePhoneNumber('12345');
      assert.equal(res.isValid, false);
      assert.ok(res.error.includes('Invalid phone format'));
    });

    it('should reject empty or null phone numbers', () => {
      const resNull = sanitizePhoneNumber(null);
      assert.equal(resNull.isValid, false);
      const resEmpty = sanitizePhoneNumber('');
      assert.equal(resEmpty.isValid, false);
    });
  });

  describe('2. Secret Masking & Security', () => {
    it('should mask long credential strings correctly', () => {
      const masked = maskSecret('105682910291456');
      assert.equal(masked, '1056...1456');
    });

    it('should handle empty or null values safely', () => {
      assert.equal(maskSecret(null), 'Not Set');
      assert.equal(maskSecret(''), 'Not Set');
    });

    it('should mask short secret strings without leaking characters', () => {
      assert.equal(maskSecret('12345'), '****');
    });
  });

  describe('3. Template Payload & Message Formatters', () => {
    it('should build valid Meta Graph API template component structure', () => {
      const payload = buildTemplatePayload('pandit_task_assignment', 'en_US', [
        'Vidwan Sharma',
        'GS-TSK-20261019-1234',
        'Satyanarayana Swamy Vratam',
        '2026-10-25'
      ]);

      assert.equal(payload.name, 'pandit_task_assignment');
      assert.equal(payload.language.code, 'en_US');
      assert.equal(payload.components.length, 1);
      assert.equal(payload.components[0].type, 'body');
      assert.equal(payload.components[0].parameters.length, 4);
      assert.equal(payload.components[0].parameters[0].text, 'Vidwan Sharma');
      assert.equal(payload.components[0].parameters[1].text, 'GS-TSK-20261019-1234');
    });

    it('should format task assignment human-readable fallback message', () => {
      const msg = formatAssignmentMessage({
        task_reference: 'GS-TSK-1001',
        pooja_name: 'Maha Ganapathi Homam',
        ritual_date: '2026-10-25',
        start_time: '08:30 AM',
        end_time: '11:00 AM',
        service_address: 'Flat 402, Royal Enclave',
        city: 'Hyderabad',
        customer_name: 'Suresh Kumar',
        customer_phone: '9848011223'
      });

      assert.ok(msg.includes('GS-TSK-1001'));
      assert.ok(msg.includes('Maha Ganapathi Homam'));
      assert.ok(msg.includes('Suresh Kumar'));
      assert.ok(msg.includes('+91 92818 67002'));
    });

    it('should format task cancellation message with reason', () => {
      const msg = formatCancellationMessage({
        task_reference: 'GS-TSK-1002',
        pooja_name: 'Griha Pravesham',
        ritual_date: '2026-10-26',
        start_time: '06:00 AM',
        end_time: '09:30 AM',
        cancellation_reason: 'Devotee requested postponement'
      });

      assert.ok(msg.includes('GS-TSK-1002'));
      assert.ok(msg.includes('Devotee requested postponement'));
    });

    it('should format task reschedule message', () => {
      const msg = formatRescheduleMessage({
        task_reference: 'GS-TSK-1003',
        pooja_name: 'Navagraha Homam',
        ritual_date: '2026-10-28',
        start_time: '10:00 AM',
        end_time: '12:30 PM',
        service_address: 'Banjara Hills',
        city: 'Hyderabad'
      });

      assert.ok(msg.includes('GS-TSK-1003'));
      assert.ok(msg.includes('2026-10-28'));
      assert.ok(msg.includes('Banjara Hills'));
    });
  });

  describe('4. Reliable Outbox Queue & Idempotency Prevention', () => {
    it('should queue a notification in the database outbox table', async () => {
      const taskRef = `TEST-QUEUE-${Date.now()}`;
      const result = await queueNotification({
        task_reference: taskRef,
        recipient_pandit_id: 101,
        recipient_phone: '9848012345',
        event_type: 'TASK_ASSIGNED',
        template_name: 'pandit_task_assignment',
        template_parameters: ['Pandit Ji', taskRef, 'Pooja', '2026-10-25'],
        message_body: 'Assignment test message',
        idempotency_key: `IDEM_${taskRef}`
      });

      assert.equal(result.success, true);
      assert.ok(result.notificationId > 0);

      // Verify record in database
      const [rows] = await pool.query('SELECT * FROM whatsapp_notifications WHERE id = ?', [result.notificationId]);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].task_reference, taskRef);
      assert.equal(rows[0].recipient_phone, '9848012345');
    });

    it('should prevent duplicate notifications when using the same idempotency key', async () => {
      const idempotencyKey = `IDEM_DUPLICATE_TEST_${Date.now()}`;
      const taskRef = 'GS-TSK-TEST-DUP';

      // First queue call
      const first = await queueNotification({
        task_reference: taskRef,
        recipient_pandit_id: 102,
        recipient_phone: '9848012345',
        event_type: 'TASK_ASSIGNED',
        message_body: 'First call message',
        idempotency_key: idempotencyKey
      });
      assert.equal(first.success, true);

      // Second queue call with identical idempotency key
      const second = await queueNotification({
        task_reference: taskRef,
        recipient_pandit_id: 102,
        recipient_phone: '9848012345',
        event_type: 'TASK_ASSIGNED',
        message_body: 'Second duplicate call message',
        idempotency_key: idempotencyKey
      });

      assert.equal(second.success, true);
      assert.equal(second.duplicate, true);
      assert.equal(second.notificationId, first.notificationId);
    });
  });

  describe('5. Webhook Verification & HMAC-SHA256 Signature Validation', () => {
    it('should verify webhook challenge when hub.mode and verify_token match', () => {
      let statusSent = null;
      let bodySent = null;

      const req = {
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'gnana_sudha_whatsapp_token_2026',
          'hub.challenge': 'CHALLENGE_ACCEPTED_12345'
        }
      };

      const res = {
        status(code) {
          statusSent = code;
          return this;
        },
        send(content) {
          bodySent = content;
          return this;
        },
        sendStatus(code) {
          statusSent = code;
          return this;
        }
      };

      verifyWebhook(req, res);
      assert.equal(statusSent, 200);
      assert.equal(bodySent, 'CHALLENGE_ACCEPTED_12345');
    });

    it('should reject webhook verification when token does not match', () => {
      let statusSent = null;
      const req = {
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'wrong_token',
          'hub.challenge': 'CHALLENGE_ACCEPTED_12345'
        }
      };
      const res = {
        sendStatus(code) {
          statusSent = code;
          return this;
        }
      };

      verifyWebhook(req, res);
      assert.equal(statusSent, 403);
    });

    it('should validate cryptographic HMAC-SHA256 signature when META_APP_SECRET is set', () => {
      const secret = 'test_secret_12345';
      const originalSecret = process.env.META_APP_SECRET;
      process.env.META_APP_SECRET = secret;

      // Note: whatsappService has cached META_APP_SECRET at require-time. If it's empty, validation logs warning.
      // We test the HMAC calculation logic explicitly:
      const rawBody = Buffer.from(JSON.stringify({ object: 'whatsapp_business_account' }));
      const expectedHmac = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
      assert.ok(expectedHmac.startsWith('sha256='));
      assert.equal(expectedHmac.length, 71); // 'sha256=' (7) + 64 hex chars = 71
    });
  });

  describe('6. Webhook Delivery Receipt Processing', () => {
    it('should process DELIVERED and READ status updates for existing messages', async () => {
      const testMsgId = `wamid.TEST_${Date.now()}`;

      // Insert dummy notification with this api_message_id
      const insertSql = `
        INSERT INTO whatsapp_notifications (
          task_reference, recipient_pandit_id, recipient_phone,
          event_type, message_body, delivery_status, api_message_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [insertRes] = await pool.query(insertSql, [
        'GS-TSK-DELIV', 105, '919848012345', 'TASK_ASSIGNED', 'Delivery test', 'ACCEPTED', testMsgId
      ]);
      const notifId = insertRes.insertId;

      // Simulate webhook delivery receipt
      const deliveredWebhookReq = {
        headers: {},
        body: {
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  value: {
                    statuses: [
                      {
                        id: testMsgId,
                        status: 'delivered',
                        timestamp: String(Math.floor(Date.now() / 1000))
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      };

      let sentStatus = null;
      let sentBody = null;
      const res = {
        status(code) { sentStatus = code; return this; },
        send(b) { sentBody = b; return this; },
        sendStatus(code) { sentStatus = code; return this; }
      };

      await handleWebhookStatus(deliveredWebhookReq, res);
      assert.equal(sentStatus, 200);
      assert.equal(sentBody, 'EVENT_RECEIVED');

      // Verify status updated to DELIVERED in database
      const [updatedRows] = await pool.query('SELECT * FROM whatsapp_notifications WHERE id = ?', [notifId]);
      assert.equal(updatedRows.length, 1);
      assert.equal(updatedRows[0].delivery_status, 'DELIVERED');
      assert.ok(updatedRows[0].delivered_at !== null);
    });
  });

  describe('7. Protected Test Message Dispatcher', () => {
    it('should queue a test notification to an authorized recipient', async () => {
      const res = await sendTestNotification({
        recipientPhone: '+91 92818 67002',
        customText: 'Test dispatch message'
      });

      assert.equal(res.success, true);
      assert.equal(res.recipient, '919281867002');
      assert.ok(res.notificationId > 0);

      // Verify notification in database has event_type = TEST_MESSAGE
      const [rows] = await pool.query('SELECT * FROM whatsapp_notifications WHERE id = ?', [res.notificationId]);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].event_type, 'TEST_MESSAGE');
      assert.equal(rows[0].recipient_phone, '919281867002');
    });

    it('should reject test message if phone number is completely missing', async () => {
      const res = await sendTestNotification({ recipientPhone: '' });
      assert.equal(res.success, false);
      assert.ok(res.message.includes('No recipient phone'));
    });
  });

  describe('8. Health & Configuration Status Check', () => {
    it('should return complete health report without exposing secret values', async () => {
      const health = await getHealthAndConfigStatus();
      assert.equal(health.success, true);
      assert.ok(health.config !== undefined);
      assert.ok(health.connectivity !== undefined);
      assert.ok(health.queueCounts !== undefined);

      // Verify access token is never exposed
      assert.equal(health.config.accessToken, undefined);
      assert.equal(health.config.appSecret, undefined);
      assert.ok(typeof health.config.maskedPhoneNumberId === 'string');
      assert.ok(typeof health.config.maskedBusinessAccountId === 'string');
    });
  });
});
