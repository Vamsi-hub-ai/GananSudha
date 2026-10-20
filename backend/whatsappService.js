const pool = require('./db');
const crypto = require('crypto');
require('dotenv').config();

// Configuration from environment variables
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'gnana_sudha_whatsapp_token_2026';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const META_API_VERSION = process.env.META_API_VERSION || 'v21.0';

// Optional template overrides and worker keys
const TEMPLATE_TASK_ASSIGNED = process.env.WHATSAPP_TEMPLATE_TASK_ASSIGNED || 'pandit_task_assignment';
const TEMPLATE_TASK_RESCHEDULED = process.env.WHATSAPP_TEMPLATE_TASK_RESCHEDULED || 'pandit_task_reschedule';
const TEMPLATE_TASK_CANCELLED = process.env.WHATSAPP_TEMPLATE_TASK_CANCELLED || 'pandit_task_cancellation';
const TEMPLATE_TASK_REASSIGNED = process.env.WHATSAPP_TEMPLATE_TASK_REASSIGNED || 'pandit_task_reassignment';
const TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US';

const WORKER_API_KEY = process.env.WORKER_API_KEY || 'gnana_sudha_worker_secret_2026';
const WHATSAPP_TEST_RECIPIENT = process.env.WHATSAPP_TEST_RECIPIENT || '';

/**
 * Check if the core Meta WhatsApp Cloud API credentials are configured
 */
function isConfigured() {
  return Boolean(
    WHATSAPP_ACCESS_TOKEN &&
    WHATSAPP_ACCESS_TOKEN.trim() &&
    WHATSAPP_PHONE_NUMBER_ID &&
    WHATSAPP_PHONE_NUMBER_ID.trim()
  );
}

/**
 * Mask sensitive string for public display (e.g. "1056...8921")
 */
function maskSecret(val) {
  if (!val || typeof val !== 'string') return 'Not Set';
  const clean = val.trim();
  if (clean.length <= 8) return '****';
  return `${clean.slice(0, 4)}...${clean.slice(-4)}`;
}

/**
 * Normalize and sanitize phone number to E.164 digits without plus sign
 * Handles standard Indian numbers (10 digits -> 91xxxxxxxxxx)
 */
function sanitizePhoneNumber(phone) {
  if (!phone) return { isValid: false, phone: '', error: 'Phone number is empty' };
  let digits = String(phone).replace(/\D/g, '');

  // Strip leading 0 if present (e.g. 09848012345)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // 10 digits -> add Indian country code 91
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  // Basic E.164 sanity check (between 11 and 15 digits)
  if (digits.length < 11 || digits.length > 15) {
    return {
      isValid: false,
      phone: digits,
      error: `Invalid phone format: expected 10 to 15 digits, received ${digits.length} digits`
    };
  }

  return { isValid: true, phone: digits, error: null };
}

/**
 * Format clean fallback readable text for the outbox log / fallback channels
 */
function formatAssignmentMessage(data) {
  const {
    task_reference,
    pooja_name,
    ritual_date,
    start_time,
    end_time,
    service_address,
    city,
    customer_name,
    customer_phone,
    special_instructions
  } = data;

  return `🙏 *Gnana Sudha — New Ritual Assignment*

Namaste, Pandit Ji.
A new ritual task has been assigned to you.

*Task ID:* \`${task_reference}\`
*Ritual:* ${pooja_name}
*Date:* ${ritual_date}
*Time:* ${start_time} – ${end_time || ''}
*Location:* ${service_address}, ${city || 'Hyderabad'}
*Customer:* ${customer_name}
*Customer Contact:* ${customer_phone || 'Shared in Pandit Portal'}
${special_instructions ? `*Special Instructions:* ${special_instructions}\n` : ''}
Please log in to your Gnana Sudha Pandit Portal to confirm your schedule:
https://gnanasudha.com/pandit/dashboard

*Gnana Sudha Admin Desk:* +91 92818 67002`;
}

function formatCancellationMessage(data) {
  const {
    task_reference,
    pooja_name,
    ritual_date,
    start_time,
    end_time,
    cancellation_reason
  } = data;

  return `🙏 *Gnana Sudha — Task Cancellation Notice*

Namaste, Pandit Ji.
The following ritual task assignment has been cancelled by administration.

*Task ID:* \`${task_reference}\`
*Ritual:* ${pooja_name}
*Scheduled Date:* ${ritual_date}
*Scheduled Time:* ${start_time} – ${end_time || ''}
*Cancellation Reason:* ${cancellation_reason || 'Administrative adjustment'}

Your calendar availability has been updated. If you have questions, please reach out to Gnana Sudha Helpline: +91 92818 67002.`;
}

function formatRescheduleMessage(data) {
  const {
    task_reference,
    pooja_name,
    ritual_date,
    start_time,
    end_time,
    service_address,
    city
  } = data;

  return `🙏 *Gnana Sudha — Ritual Schedule Updated*

Namaste, Pandit Ji.
The scheduled date and time for ritual task \`${task_reference}\` (${pooja_name}) have been updated.

*Updated Date:* ${ritual_date}
*Updated Time:* ${start_time} – ${end_time || ''}
*Location:* ${service_address}, ${city || 'Hyderabad'}

Please review your calendar in the Pandit Portal.
*Gnana Sudha Helpline:* +91 92818 67002`;
}

/**
 * Build Meta Graph API template payload components
 */
function buildTemplatePayload(templateName, languageCode, parameters = []) {
  return {
    name: templateName,
    language: {
      code: languageCode || TEMPLATE_LANG
    },
    components: [
      {
        type: 'body',
        parameters: parameters.map(p => ({
          type: 'text',
          text: String(p || '').slice(0, 1024)
        }))
      }
    ]
  };
}

/**
 * Queue a notification in the reliable outbox table with idempotency check
 */
async function queueNotification({
  task_reference,
  task_id = null,
  recipient_pandit_id,
  recipient_phone,
  event_type,
  template_name = null,
  template_language = TEMPLATE_LANG,
  template_parameters = [],
  message_body,
  idempotency_key = null
}) {
  const initialStatus = isConfigured() ? 'QUEUED' : 'NOT_CONFIGURED';
  const lastError = isConfigured()
    ? null
    : 'Meta WhatsApp credentials missing in server environment. Logged in outbox for dispatch once configured.';

  // Determine standard template name based on event type if not provided
  let selectedTemplate = template_name;
  if (!selectedTemplate) {
    if (event_type === 'TASK_ASSIGNED') selectedTemplate = TEMPLATE_TASK_ASSIGNED;
    else if (event_type === 'TASK_RESCHEDULED') selectedTemplate = TEMPLATE_TASK_RESCHEDULED;
    else if (event_type === 'TASK_CANCELLED') selectedTemplate = TEMPLATE_TASK_CANCELLED;
    else if (event_type === 'TASK_REASSIGNED') selectedTemplate = TEMPLATE_TASK_REASSIGNED;
    else selectedTemplate = 'pandit_task_assignment';
  }

  // Generate idempotency key if not explicitly given: `${task_reference}_${event_type}_${recipient_pandit_id}`
  const finalIdempotencyKey = idempotency_key || `${task_reference}_${event_type}_${recipient_pandit_id}_${Date.now()}`;

  try {
    // Check for existing notification with same idempotency key
    if (idempotency_key) {
      const [existing] = await pool.query(
        'SELECT * FROM whatsapp_notifications WHERE idempotency_key = ?',
        [idempotency_key]
      );
      if (existing && existing.length > 0) {
        console.log(`[WhatsApp Outbox] Duplicate notification prevented by idempotency key: ${idempotency_key}`);
        return {
          success: true,
          duplicate: true,
          notificationId: existing[0].id,
          status: existing[0].delivery_status,
          isConfigured: isConfigured()
        };
      }
    }

    const insertSql = `
      INSERT INTO whatsapp_notifications (
        task_reference,
        task_id,
        recipient_pandit_id,
        recipient_phone,
        event_type,
        template_name,
        template_language,
        template_parameters,
        message_body,
        delivery_status,
        attempt_count,
        max_attempts,
        idempotency_key,
        last_error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      task_reference,
      task_id,
      recipient_pandit_id,
      recipient_phone,
      event_type,
      selectedTemplate,
      template_language,
      JSON.stringify(template_parameters || []),
      message_body,
      initialStatus,
      0,
      5,
      finalIdempotencyKey,
      lastError
    ]);

    const notificationId = result.insertId;

    // Trigger immediate background worker dispatch if credentials are ready
    if (isConfigured()) {
      setImmediate(() => {
        dispatchSingleNotification(notificationId).catch(err => {
          console.error('[WhatsApp Background Worker]', err.message);
        });
      });
    }

    return {
      success: true,
      notificationId,
      status: initialStatus,
      isConfigured: isConfigured()
    };
  } catch (err) {
    console.error('[WhatsApp Outbox Queue Error]', err);
    throw err;
  }
}

/**
 * Calculate bounded exponential backoff in seconds
 * Attempt 1: 60s, Attempt 2: 300s (5m), Attempt 3: 1200s (20m), Attempt 4: 3600s (1h), Attempt 5: 14400s (4h)
 */
function calculateBackoffSeconds(attempt) {
  const schedule = [60, 300, 1200, 3600, 14400];
  const idx = Math.min(attempt - 1, schedule.length - 1);
  return schedule[idx] || 3600;
}

/**
 * Dispatch a single notification through official Meta Graph API
 */
async function dispatchSingleNotification(notificationId) {
  if (!isConfigured()) {
    await pool.query(
      `UPDATE whatsapp_notifications 
       SET delivery_status = 'NOT_CONFIGURED',
           last_error = 'Meta WhatsApp API credentials missing in .env'
       WHERE id = ?`,
      [notificationId]
    );
    return { success: false, status: 'NOT_CONFIGURED', error: 'Credentials not configured' };
  }

  // Atomically claim the row to avoid concurrent workers duplicating sends
  const [claimResult] = await pool.query(
    `UPDATE whatsapp_notifications 
     SET delivery_status = 'PROCESSING'
     WHERE id = ? AND delivery_status IN ('QUEUED', 'PENDING', 'FAILED')`,
    [notificationId]
  );

  const [rows] = await pool.query('SELECT * FROM whatsapp_notifications WHERE id = ?', [notificationId]);
  if (!rows || rows.length === 0) {
    return { success: false, message: 'Notification not found' };
  }

  const notif = rows[0];
  const { isValid, phone, error: phoneError } = sanitizePhoneNumber(notif.recipient_phone);

  if (!isValid) {
    const errorMsg = `Invalid recipient phone number: ${phoneError}`;
    await pool.query(
      `UPDATE whatsapp_notifications 
       SET delivery_status = 'FAILED',
           attempt_count = attempt_count + 1,
           last_error = ?,
           error_code = 'INVALID_PHONE'
       WHERE id = ?`,
      [errorMsg, notificationId]
    );
    return { success: false, error: errorMsg, status: 'FAILED' };
  }

  const url = `https://graph.facebook.com/${META_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  // Parse template parameters
  let templateParams = [];
  try {
    if (typeof notif.template_parameters === 'string') {
      templateParams = JSON.parse(notif.template_parameters);
    } else if (Array.isArray(notif.template_parameters)) {
      templateParams = notif.template_parameters;
    }
  } catch {
    templateParams = [];
  }

  // Construct official Meta WhatsApp message payload
  let payload;
  if (notif.template_name && templateParams.length > 0) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'template',
      template: buildTemplatePayload(notif.template_name, notif.template_language, templateParams)
    };
  } else {
    // Standard template without params or text message
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'text',
      text: {
        preview_url: false,
        body: notif.message_body
      }
    };
  }

  const currentAttempt = (notif.attempt_count || 0) + 1;
  const maxAttempts = notif.max_attempts || 5;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12-second HTTP timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.messages && data.messages.length > 0) {
      const metaMessageId = data.messages[0].id; // e.g. "wamid.HBg..."

      // Mark as ACCEPTED / SENT by Graph API (Delivery confirmed ONLY via webhook)
      await pool.query(
        `UPDATE whatsapp_notifications 
         SET delivery_status = 'ACCEPTED',
             api_message_id = ?,
             attempt_count = ?,
             sent_at = NOW(),
             last_error = NULL,
             error_code = NULL,
             response_payload = ?
         WHERE id = ?`,
        [metaMessageId, currentAttempt, JSON.stringify(data), notificationId]
      );

      console.log(`[WhatsApp Success] Notification #${notificationId} accepted by Meta Graph API. Meta Msg ID: ${metaMessageId}`);
      return { success: true, messageId: metaMessageId, status: 'ACCEPTED' };
    } else {
      const metaError = data.error || {};
      const errorCode = metaError.code ? String(metaError.code) : `HTTP_${response.status}`;
      const errorMessage = metaError.message || data.message || response.statusText || 'Meta Graph API call failed';
      const errorSubcode = metaError.error_subcode ? ` (Subcode: ${metaError.error_subcode})` : '';
      const fullError = `${errorMessage}${errorSubcode}`.slice(0, 500);

      // Check if permanent error: e.g. code 131026 (Message undeliverable), 100 (Invalid param), 132001 (Template missing)
      const isPermanent = ['100', '131026', '132000', '132001', '132015', '131047'].includes(errorCode) || currentAttempt >= maxAttempts;
      
      let nextRetryClause = 'next_retry_at = NULL';
      if (!isPermanent && currentAttempt < maxAttempts) {
        const backoffSeconds = calculateBackoffSeconds(currentAttempt);
        const retryTime = new Date(Date.now() + backoffSeconds * 1000).toISOString().slice(0, 19).replace('T', ' ');
        nextRetryClause = `next_retry_at = '${retryTime}'`;
      }

      await pool.query(
        `UPDATE whatsapp_notifications 
         SET delivery_status = 'FAILED',
             attempt_count = ?,
             ${nextRetryClause},
             error_code = ?,
             last_error = ?,
             response_payload = ?
         WHERE id = ?`,
        [currentAttempt, errorCode, fullError, JSON.stringify(data), notificationId]
      );

      console.warn(`[WhatsApp API Error] Notification #${notificationId} failed. Code: ${errorCode}. Error: ${fullError}`);
      return { success: false, status: 'FAILED', error: fullError, errorCode, willRetry: !isPermanent };
    }
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    const errorMsg = isTimeout ? 'Request timed out after 12 seconds' : err.message;
    const backoffSeconds = calculateBackoffSeconds(currentAttempt);
    const retryTime = new Date(Date.now() + backoffSeconds * 1000).toISOString().slice(0, 19).replace('T', ' ');

    await pool.query(
      `UPDATE whatsapp_notifications 
       SET delivery_status = 'FAILED',
           attempt_count = ?,
           next_retry_at = ?,
           error_code = ?,
           last_error = ?
       WHERE id = ?`,
      [currentAttempt, retryTime, isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR', errorMsg, notificationId]
    );

    console.error(`[WhatsApp Network Error] Notification #${notificationId}:`, errorMsg);
    return { success: false, status: 'FAILED', error: errorMsg, willRetry: currentAttempt < maxAttempts };
  }
}

/**
 * Process pending outbox messages in batches
 */
async function processOutbox({ limit = 10 } = {}) {
  if (!isConfigured()) return { processed: 0, reason: 'NOT_CONFIGURED' };

  try {
    const [pendingRows] = await pool.query(
      `SELECT id FROM whatsapp_notifications 
       WHERE delivery_status IN ('QUEUED', 'PENDING') 
          OR (delivery_status = 'FAILED' AND attempt_count < max_attempts AND (next_retry_at IS NULL OR next_retry_at <= NOW()))
       ORDER BY id ASC 
       LIMIT ?`,
      [parseInt(limit, 10) || 10]
    );

    let sent = 0;
    let failed = 0;

    for (const item of (pendingRows || [])) {
      const result = await dispatchSingleNotification(item.id);
      if (result.success) sent++;
      else failed++;
    }

    return {
      success: true,
      processed: (pendingRows || []).length,
      sent,
      failed
    };
  } catch (err) {
    console.error('[WhatsApp processOutbox Error]', err.message);
    return { success: false, error: err.message, processed: 0 };
  }
}

/**
 * Validate Meta Webhook Signature using HMAC-SHA256 and META_APP_SECRET
 */
function validateWebhookSignature(req) {
  if (!META_APP_SECRET) {
    // If META_APP_SECRET is not configured in env, log a warning but allow for development
    console.warn('[WhatsApp Webhook] META_APP_SECRET not set in .env. Skipping cryptographic signature check.');
    return true;
  }

  const signatureHeader = req.headers['x-hub-signature-256'];
  if (!signatureHeader) {
    console.warn('[WhatsApp Webhook] Missing x-hub-signature-256 header.');
    return false;
  }

  const rawBody = req.rawBody ? req.rawBody : Buffer.from(JSON.stringify(req.body || {}));
  const expectedSignature = `sha256=${crypto.createHmac('sha256', META_APP_SECRET).update(rawBody).digest('hex')}`;

  try {
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

/**
 * Handle incoming Meta Webhook Status updates (sent, delivered, read, failed)
 */
async function handleWebhookStatus(req, res) {
  // Validate incoming webhook signature
  if (!validateWebhookSignature(req)) {
    console.warn('[WhatsApp Webhook] Invalid HMAC-SHA256 signature rejected.');
    return res.status(401).send('Invalid signature');
  }

  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const statuses = value.statuses || [];

          for (const statusObj of statuses) {
            const apiMessageId = statusObj.id; // Meta wamid
            const rawStatus = String(statusObj.status).toUpperCase(); // SENT, DELIVERED, READ, FAILED
            const timestamp = statusObj.timestamp ? new Date(parseInt(statusObj.timestamp, 10) * 1000) : new Date();

            let updateSql = '';
            const updateParams = [];

            if (rawStatus === 'DELIVERED') {
              updateSql = `
                UPDATE whatsapp_notifications 
                SET delivery_status = 'DELIVERED', 
                    delivered_at = ? 
                WHERE api_message_id = ?
              `;
              updateParams.push(timestamp, apiMessageId);
            } else if (rawStatus === 'READ') {
              updateSql = `
                UPDATE whatsapp_notifications 
                SET delivery_status = 'READ', 
                    read_at = ? 
                WHERE api_message_id = ?
              `;
              updateParams.push(timestamp, apiMessageId);
            } else if (rawStatus === 'SENT') {
              updateSql = `
                UPDATE whatsapp_notifications 
                SET delivery_status = 'SENT',
                    sent_at = IFNULL(sent_at, ?)
                WHERE api_message_id = ? AND delivery_status NOT IN ('DELIVERED', 'READ')
              `;
              updateParams.push(timestamp, apiMessageId);
            } else if (rawStatus === 'FAILED') {
              const errors = statusObj.errors || [];
              const firstErr = errors[0] || {};
              const errDesc = firstErr.title || firstErr.message || 'Delivery failed';
              const errCode = firstErr.code ? String(firstErr.code) : 'DELIVERY_FAILED';

              updateSql = `
                UPDATE whatsapp_notifications 
                SET delivery_status = 'FAILED',
                    error_code = ?,
                    last_error = ?
                WHERE api_message_id = ?
              `;
              updateParams.push(errCode, errDesc, apiMessageId);
            }

            if (updateSql) {
              await pool.query(updateSql, updateParams);
              console.log(`[WhatsApp Webhook] Message ${apiMessageId} status updated to: ${rawStatus}`);
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
    res.sendStatus(404);
  } catch (err) {
    console.error('[WhatsApp Webhook Handler Error]', err);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * Verify Webhook for Meta Setup (hub.challenge handshake)
 */
function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('[WhatsApp Webhook] Webhook verified successfully by Meta challenge.');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WhatsApp Webhook Verification Failed] Invalid verify token.');
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
}

/**
 * Retrieve comprehensive configuration and health metrics for Admin Dashboard
 */
async function getHealthAndConfigStatus() {
  const configured = isConfigured();
  const config = {
    isConfigured: configured,
    accessTokenSet: Boolean(WHATSAPP_ACCESS_TOKEN && WHATSAPP_ACCESS_TOKEN.trim()),
    phoneNumberIdSet: Boolean(WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_PHONE_NUMBER_ID.trim()),
    businessAccountIdSet: Boolean(WHATSAPP_BUSINESS_ACCOUNT_ID && WHATSAPP_BUSINESS_ACCOUNT_ID.trim()),
    appSecretSet: Boolean(META_APP_SECRET && META_APP_SECRET.trim()),
    verifyTokenSet: Boolean(WHATSAPP_VERIFY_TOKEN),
    apiVersion: META_API_VERSION,
    maskedPhoneNumberId: maskSecret(WHATSAPP_PHONE_NUMBER_ID),
    maskedBusinessAccountId: maskSecret(WHATSAPP_BUSINESS_ACCOUNT_ID),
    webhookVerifyToken: WHATSAPP_VERIFY_TOKEN ? 'Verified (Configured)' : 'Default',
    templates: {
      taskAssigned: TEMPLATE_TASK_ASSIGNED,
      taskRescheduled: TEMPLATE_TASK_RESCHEDULED,
      taskCancelled: TEMPLATE_TASK_CANCELLED,
      taskReassigned: TEMPLATE_TASK_REASSIGNED,
      language: TEMPLATE_LANG
    }
  };

  // Connectivity check if credentials exist
  let connectivity = { status: 'PENDING_CONFIG', message: 'Credentials not yet set in environment' };
  if (configured) {
    try {
      const testUrl = `https://graph.facebook.com/${META_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const testRes = await fetch(testUrl, {
        headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const testData = await testRes.json();

      if (testRes.ok) {
        connectivity = {
          status: 'CONNECTED',
          verifiedName: testData.verified_name || 'Gnana Sudha',
          displayPhoneNumber: testData.display_phone_number || '',
          qualityRating: testData.quality_rating || 'GREEN',
          codeVerificationStatus: testData.code_verification_status || 'VERIFIED'
        };
      } else {
        connectivity = {
          status: 'AUTH_ERROR',
          code: testData.error?.code,
          message: testData.error?.message || 'Authentication failed'
        };
      }
    } catch (e) {
      connectivity = {
        status: 'NETWORK_ERROR',
        message: e.message
      };
    }
  }

  // Queue metrics by status from database
  let queueCounts = {
    TOTAL: 0,
    QUEUED: 0,
    PROCESSING: 0,
    ACCEPTED: 0,
    SENT: 0,
    DELIVERED: 0,
    READ: 0,
    FAILED: 0,
    NOT_CONFIGURED: 0
  };

  let lastDelivery = null;
  let latestError = null;

  try {
    const [countRows] = await pool.query(
      `SELECT delivery_status, COUNT(*) as count 
       FROM whatsapp_notifications 
       GROUP BY delivery_status`
    );

    (countRows || []).forEach(r => {
      const st = String(r.delivery_status || '').toUpperCase();
      if (queueCounts[st] !== undefined) {
        queueCounts[st] = Number(r.count);
      }
      queueCounts.TOTAL += Number(r.count);
    });

    const [lastDelivRows] = await pool.query(
      `SELECT delivered_at, task_reference, recipient_phone 
       FROM whatsapp_notifications 
       WHERE delivery_status IN ('DELIVERED', 'READ') AND delivered_at IS NOT NULL
       ORDER BY delivered_at DESC LIMIT 1`
    );
    if (lastDelivRows && lastDelivRows.length > 0) {
      lastDelivery = lastDelivRows[0];
    }

    const [errRows] = await pool.query(
      `SELECT last_error, error_code, updated_at, task_reference 
       FROM whatsapp_notifications 
       WHERE last_error IS NOT NULL AND delivery_status = 'FAILED'
       ORDER BY id DESC LIMIT 1`
    );
    if (errRows && errRows.length > 0) {
      latestError = errRows[0];
    }
  } catch (err) {
    console.warn('[WhatsApp Status DB]', err.message);
  }

  return {
    success: true,
    config,
    connectivity,
    queueCounts,
    lastDelivery,
    latestError
  };
}

/**
 * Send a controlled test message to an authorized test recipient
 */
async function sendTestNotification({ recipientPhone, customText = null }) {
  let targetPhone = recipientPhone;
  if (targetPhone === undefined || targetPhone === null) {
    targetPhone = WHATSAPP_TEST_RECIPIENT;
  }
  if (!targetPhone || !String(targetPhone).trim()) {
    return {
      success: false,
      message: 'No recipient phone provided and WHATSAPP_TEST_RECIPIENT is not configured.'
    };
  }

  const { isValid, phone, error } = sanitizePhoneNumber(targetPhone);
  if (!isValid) {
    return { success: false, message: `Invalid test recipient number: ${error}` };
  }

  const taskRef = `TEST-${Date.now().toString().slice(-6)}`;
  const messageBody = customText || `🙏 *Gnana Sudha — Official WhatsApp Cloud API Test Message*

Namaste.
This is a secure automated test notification confirming that Meta WhatsApp Business Cloud API is active and connected for Gnana Sudha.

*Timestamp:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
*Environment:* Node.js / MySQL / Hostinger VPS
*Helpline:* +91 92818 67002`;

  const result = await queueNotification({
    task_reference: taskRef,
    recipient_pandit_id: 0,
    recipient_phone: phone,
    event_type: 'TEST_MESSAGE',
    message_body: messageBody,
    idempotency_key: `TEST_${phone}_${Date.now()}`
  });

  return {
    success: true,
    message: 'Test notification queued for dispatch.',
    recipient: phone,
    notificationId: result.notificationId
  };
}

module.exports = {
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
  sendTestNotification,
  WORKER_API_KEY
};
