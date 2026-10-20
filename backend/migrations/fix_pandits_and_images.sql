-- Gnana Sudha Database Fix & Migration for Hostinger
-- Run this in Hostinger phpMyAdmin (SQL tab) if you want an immediate manual fix.
-- Note: The Node.js backend also executes these migrations automatically on startup!

-- 1. Ensure pandits table has all required columns and nullable credentials
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS experience VARCHAR(100) DEFAULT '5+ Years';
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS img LONGTEXT NULL;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS languages VARCHAR(255) DEFAULT 'Telugu, Sanskrit, Hindi';
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Hyderabad, Telangana';
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS bio TEXT NULL;
ALTER TABLE pandits MODIFY COLUMN username VARCHAR(255) NULL;
ALTER TABLE pandits MODIFY COLUMN password VARCHAR(255) NULL DEFAULT 'password123';
ALTER TABLE pandits MODIFY COLUMN status VARCHAR(50) DEFAULT 'Approved';

-- 2. Upgrade image columns to LONGTEXT to support Base64 images and URLs without truncation
ALTER TABLE poojas MODIFY COLUMN img LONGTEXT NULL;
ALTER TABLE homams MODIFY COLUMN img LONGTEXT NULL;
ALTER TABLE products MODIFY COLUMN image LONGTEXT NULL;
ALTER TABLE categories MODIFY COLUMN image LONGTEXT NULL;

-- 3. Add Telugu columns if not exists
ALTER TABLE poojas ADD COLUMN IF NOT EXISTS name_te VARCHAR(255) NULL;
ALTER TABLE poojas ADD COLUMN IF NOT EXISTS desc_te TEXT NULL;
ALTER TABLE homams ADD COLUMN IF NOT EXISTS name_te VARCHAR(255) NULL;
ALTER TABLE homams ADD COLUMN IF NOT EXISTS desc_te TEXT NULL;

-- 4. Seed default verified pandits with proper images
INSERT IGNORE INTO pandits (id, username, password, name, phone, specialization, experience, rating, reviews, status, gender, img, languages, city) VALUES
(1, 'pandit.sharma@gnanasudha.com', 'password123', 'Vidwan Rama Sharma', '+91 98480 12345', 'Satyanarayana Vratham & Gruhapravesham Specialist', '18+ years', '4.9', '124', 'Approved', 'male', '/assets/gruhapravesham_pandit_1782492787455.png', 'Telugu, Sanskrit, Hindi', 'Hyderabad, Telangana'),
(2, 'pandit.shastry@gnanasudha.com', 'password123', 'Acharya Venkata Shastry', '+91 98480 23456', 'Homams, Havans & Vedic Vivaham', '22+ years', '5.0', '98', 'Approved', 'male', '/assets/homam_specialist_1782492829402.png', 'Telugu, Sanskrit', 'Hyderabad, Telangana'),
(3, 'pandita.manju@gnanasudha.com', 'password123', 'Manju', '+91 98480 34567', 'Devi Poojas, Lalitha Sahasranamam & Chanting', '15+ years', '4.9', '84', 'Approved', 'female', '/assets/female_pandit.png', 'Telugu, Sanskrit, Kannada', 'Hyderabad, Telangana'),
(4, 'pandit.vamsi@gnanasudha.com', 'password123', 'vamsi', '+91 98480 45678', 'Vedic Rituals', '0-2 Years', '5.0', '12', 'Approved', 'male', '/assets/male_pandit.png', 'Telugu, English', 'Hyderabad, Telangana');

-- Update any existing pandits with empty images to valid avatars
UPDATE pandits SET img = '/assets/gruhapravesham_pandit_1782492787455.png' WHERE id = 1 AND (img IS NULL OR img = '' OR img = '/assets/avatar_placeholder.png');
UPDATE pandits SET img = '/assets/homam_specialist_1782492829402.png' WHERE id = 2 AND (img IS NULL OR img = '' OR img = '/assets/avatar_placeholder.png');
UPDATE pandits SET img = '/assets/female_pandit.png' WHERE id = 3 AND (img IS NULL OR img = '' OR img = '/assets/avatar_placeholder.png');
UPDATE pandits SET img = '/assets/male_pandit.png' WHERE id = 4 AND (img IS NULL OR img = '' OR img = '/assets/avatar_placeholder.png');
UPDATE pandits SET img = '/assets/male_pandit.png' WHERE img IS NULL OR img = '' OR img = '/assets/avatar_placeholder.png';

-- 5. Seed default poojas if missing
INSERT IGNORE INTO poojas (id, name, `desc`, price, `discountPrice`, img) VALUES
(1, 'Sri Satyanarayana Swamy Vratham', 'Auspicious ritual dedicated to Lord Vishnu for peace, prosperity, removing obstacles, and family harmony.', 3500.00, 2999.00, '/assets/satyanarayana_vratham_1782492802363.png'),
(2, 'Gruhapravesham Pooja', 'Sacred housewarming ceremony with Vastu Shanti and Navagraha blessings before entering your new home.', 5500.00, 4800.00, '/assets/gruhapravesham_pandit_1782492787455.png'),
(3, 'Vivaham (Vedic Wedding Rituals)', 'Complete traditional wedding ceremonies performed strictly as per Vedic Shastras by senior scholarly priests.', 15000.00, 12500.00, '/assets/vivaham_priest_1782492816322.png'),
(4, 'Nitya Devatha Archana & Daily Pooja', 'Daily devotional pooja performed at your home or office for divine positive vibrations and abundance.', 1500.00, 1200.00, '/assets/daily_pooja_1782492845891.png');

-- 6. Seed default homams if missing
INSERT IGNORE INTO homams (id, name, `desc`, price, `discountPrice`, img) VALUES
(1, 'Sri Maha Ganapathi Homam', 'Powerful Vedic fire ritual invoking Lord Ganesha to eliminate hurdles, bring auspicious beginnings, and ensure success.', 4500.00, 3800.00, '/assets/homam_specialist_1782492829402.png'),
(2, 'Sudarshana Homam', 'Vedic fire ritual dedicated to Lord Sudarshana for protection against negative energies, health restoration, and victory.', 5000.00, 4200.00, '/assets/homam_specialist_1782492829402.png'),
(3, 'Navagraha Homam', 'Homam performed to appease all nine planetary deities, pacifying graha doshas and blessing you with prosperity and health.', 5500.00, 4600.00, '/assets/homam_specialist_1782492829402.png'),
(4, 'Maha Mrityunjaya Homam', 'Sacred havan dedicated to Lord Shiva for health recovery, longevity, rejuvenation, and freedom from fear.', 6000.00, 5100.00, '/assets/homam_specialist_1782492829402.png');
