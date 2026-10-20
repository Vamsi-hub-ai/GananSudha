-- Migration: Upgrade whatsapp_notifications table for Meta WhatsApp Cloud API Outbox
-- Safe execution on Hostinger MySQL / MariaDB

SET @dbname = DATABASE();

-- 1. Ensure columns exist
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'task_id') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN task_id INT NULL AFTER task_reference'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'template_language') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN template_language VARCHAR(10) DEFAULT "en_US" AFTER template_name'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'template_parameters') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN template_parameters JSON NULL AFTER template_language'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'max_attempts') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN max_attempts INT DEFAULT 5 AFTER attempt_count'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'next_retry_at') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN next_retry_at DATETIME NULL AFTER max_attempts'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'idempotency_key') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN idempotency_key VARCHAR(191) NULL UNIQUE AFTER next_retry_at'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'error_code') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN error_code VARCHAR(50) NULL AFTER idempotency_key'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'sent_at') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN sent_at DATETIME NULL AFTER response_payload'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'delivered_at') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN delivered_at DATETIME NULL AFTER sent_at'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'whatsapp_notifications' AND COLUMN_NAME = 'read_at') > 0,
  'SELECT 1',
  'ALTER TABLE whatsapp_notifications ADD COLUMN read_at DATETIME NULL AFTER delivered_at'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Modify ENUMs for delivery_status and event_type
ALTER TABLE whatsapp_notifications 
  MODIFY COLUMN event_type ENUM('TASK_ASSIGNED', 'TASK_RESCHEDULED', 'TASK_CANCELLED', 'TASK_REASSIGNED', 'SCHEDULE_UPDATE', 'TEST_MESSAGE') NOT NULL,
  MODIFY COLUMN delivery_status ENUM('QUEUED', 'PENDING', 'PROCESSING', 'ACCEPTED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED', 'NOT_CONFIGURED') DEFAULT 'QUEUED';
