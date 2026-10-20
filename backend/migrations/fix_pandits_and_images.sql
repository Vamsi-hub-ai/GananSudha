-- Gnana Sudha Database Fix & Migration for Hostinger
-- Run this in Hostinger phpMyAdmin (SQL tab) if you want an immediate manual fix.
-- Note: The Node.js backend also executes these migrations automatically on startup!

-- 1. Recreate pandits table cleanly with LONGTEXT image support and all columns
DROP TABLE IF EXISTS pandits;
CREATE TABLE pandits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NULL,
    password VARCHAR(255) NULL DEFAULT 'password123',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    specialization VARCHAR(255) DEFAULT 'Vedic Rituals',
    experience VARCHAR(100) DEFAULT '5+ Years',
    rating VARCHAR(10) DEFAULT '5.0',
    reviews VARCHAR(10) DEFAULT '0',
    status VARCHAR(50) DEFAULT 'Approved',
    gender VARCHAR(20) DEFAULT 'male',
    img LONGTEXT NULL,
    languages VARCHAR(255) DEFAULT 'Telugu, Sanskrit, Hindi',
    city VARCHAR(100) DEFAULT 'Hyderabad, Telangana',
    bio TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- 7. Create Hindu Festivals calendar table
CREATE TABLE IF NOT EXISTS festivals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    festival_key VARCHAR(100) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    day_te VARCHAR(50) DEFAULT '',
    day_en VARCHAR(50) DEFAULT '',
    category VARCHAR(50) DEFAULT 'major',
    tradition VARCHAR(100) DEFAULT 'Telugu Amanta (Andhra & Telangana)',
    description_en TEXT NULL,
    description_te TEXT NULL,
    puja_muhurat_en VARCHAR(255) NULL,
    puja_muhurat_te VARCHAR(255) NULL,
    icon VARCHAR(50) DEFAULT '🕉️',
    is_active BOOLEAN DEFAULT 1,
    is_custom BOOLEAN DEFAULT 0,
    source VARCHAR(100) DEFAULT 'Astronomical Ephemeris (Drik Ganita)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_year_month (year, month),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Create Dynamic YouTube Videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NULL,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_video_id VARCHAR(50) NOT NULL,
    description TEXT NULL,
    description_te TEXT NULL,
    category VARCHAR(100) DEFAULT 'Pooja',
    thumbnail_url VARCHAR(500) NULL,
    display_order INT DEFAULT 0,
    is_homepage_featured BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_yt_status (status),
    INDEX idx_yt_featured (is_homepage_featured),
    INDEX idx_yt_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Seed default YouTube videos if table is empty
INSERT IGNORE INTO youtube_videos 
(id, title, title_te, youtube_url, youtube_video_id, description, description_te, category, thumbnail_url, display_order, is_homepage_featured, status) VALUES
(1, 'Sri Maha Ganapathi Homam & Sankalpam Rituals', 'శ్రీ మహా గణపతి హోమం & సంకల్ప పూజా విధానం', 'https://www.youtube.com/watch?v=kYJp38X-9_k', 'kYJp38X-9_k', 'Witness the sacred invocation of Lord Ganesha by scholarly Vedic pandits for removing obstacles and bringing prosperity.', 'విఘ్న నివారణ మరియు సకల కార్యసిద్ధి కొరకు విద్వత్ పండితులచే నిర్వహించబడిన సంప్రదాయ శ్రీ మహాగణపతి హోమ దృశ్యాలు.', 'Homam', 'https://img.youtube.com/vi/kYJp38X-9_k/hqdefault.jpg', 1, 1, 'published'),
(2, 'Sri Satyanarayana Swamy Vratam Complete Katha & Pooja', 'శ్రీ సత్యనారాయణ స్వామి వ్రత కథ & సంపూర్ణ పూజ', 'https://www.youtube.com/watch?v=0h6Q5XQ_0lE', '0h6Q5XQ_0lE', 'Step-by-step sacred Satyanarayana Swamy Pooja recitation, Kalasha sthapana, and prasadam offerings.', 'కలశస్థాపన, నవగ్రహ పూజ, వ్రత కథా శ్రవణం మరియు ప్రసాద వితరణతో కూడిన సంపూర్ణ సత్యనారాయణ వ్రత పూజా విధానం.', 'Pooja', 'https://img.youtube.com/vi/0h6Q5XQ_0lE/hqdefault.jpg', 2, 1, 'published'),
(3, 'Maha Mrityunjaya Homam for Health, Healing & Longevity', 'ఆరోగ్య ఆయుర్వృద్ధి కొరకు మహా మృత్యుంజయ హోమం', 'https://www.youtube.com/watch?v=J9fP87Z8k0I', 'J9fP87Z8k0I', 'Vedic recitation of the sacred Tryambakam mantra with 108 ahutis of amrita valli and sesame oblations.', 'దీర్ఘకాలిక అనారోగ్య నివారణ, ఆయురారోగ్య రక్షణ కొరకు 108 అమృతవల్లి ఆహుతులతో కూడిన మహా మృత్యుంజయ హవనం.', 'Homam', 'https://img.youtube.com/vi/J9fP87Z8k0I/hqdefault.jpg', 3, 1, 'published'),
(4, 'Sacred Shiva Linga Rudrabhishekam with Namakam & Chamakam', 'శ్రీ రుద్రాభిషేకం (నమకం & చమక సహిత శివ పూజ)', 'https://www.youtube.com/watch?v=M5A7D8K9l4s', 'M5A7D8K9l4s', 'Holy abhishekam with milk, honey, sugarcane juice, and sacred vibhooti performed by senior purohits.', 'క్షీర, మధు, ఇక్షురస, భస్మ అభిషేకములతో వేద పండితులచే శాస్త్రోక్తంగా నిర్వహించబడే దివ్య రుద్రాభిషేక దర్శనం.', 'Pooja', 'https://img.youtube.com/vi/M5A7D8K9l4s/hqdefault.jpg', 4, 1, 'published'),
(5, 'Navagraha Shanti Homam & Dosha Nivarana Vidhanam', 'నవగ్రహ శాంతి హోమం & దోష నివారణ పద్ధతి', 'https://www.youtube.com/watch?v=P8m4F9A2b3c', 'P8m4F9A2b3c', 'Harmonizing the planetary influences through nine sacred grains and dedicated Vedic graha suktams.', 'జాతక దోషాల ఉపశమనం, గ్రహ శాంతి మరియు కుటుంబ క్షేమం కొరకు నవధాన్య ఆహుతులతో నిర్వహించే శాంతి హోమం.', 'Spiritual Guidance', 'https://img.youtube.com/vi/P8m4F9A2b3c/hqdefault.jpg', 5, 1, 'published'),
(6, 'Sri Lakshmi Kubera Pooja for Abundance & Financial Harmony', 'సిరిసంపదల కొరకు శ్రీ లక్ష్మీ కుబేర పూజా విధానం', 'https://www.youtube.com/watch?v=T6v8N4Q1d7e', 'T6v8N4Q1d7e', 'Divine worship of Goddess Maha Lakshmi and Lord Kubera with lotus flowers and kumkum archana.', 'కమల పుష్పాలు, కుంకుమార్చన మరియు కనకధారా స్తోత్ర పారాయణంతో అమ్మవారి దివ్య అనుగ్రహం పొందే పూజ.', 'Festivals', 'https://img.youtube.com/vi/T6v8N4Q1d7e/hqdefault.jpg', 6, 1, 'published');
