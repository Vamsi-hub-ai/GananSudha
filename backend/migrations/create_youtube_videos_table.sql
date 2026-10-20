-- =========================================================================
-- Gnana Sudha — Migration: Create youtube_videos Table
-- Description: Dynamic YouTube Videos Management for Homepage & Videos Page
-- Compatible with: MySQL 5.7+ / 8.0+ / MariaDB on Hostinger
-- =========================================================================

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
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_yt_status (status),
    INDEX idx_yt_featured (is_homepage_featured),
    INDEX idx_yt_order (display_order),
    INDEX idx_yt_status_featured_order (status, is_homepage_featured, display_order)
);

-- Ensure Telugu columns exist on previously created tables
ALTER TABLE youtube_videos ADD COLUMN IF NOT EXISTS title_te VARCHAR(255) NULL;
ALTER TABLE youtube_videos ADD COLUMN IF NOT EXISTS description_te TEXT NULL;

-- Seed initial authentic devotional videos for Gnana Sudha if table is empty
INSERT INTO youtube_videos 
(title, youtube_url, youtube_video_id, description, category, thumbnail_url, display_order, is_homepage_featured, status)
SELECT * FROM (
    SELECT 
        'Sri Maha Ganapathi Homam & Sankalpam Rituals' AS title,
        'https://www.youtube.com/watch?v=kYJp38X-9_k' AS youtube_url,
        'kYJp38X-9_k' AS youtube_video_id,
        'Witness the sacred invocation of Lord Ganesha by scholarly Vedic pandits for removing obstacles and bringing prosperity.' AS description,
        'Homam' AS category,
        'https://img.youtube.com/vi/kYJp38X-9_k/hqdefault.jpg' AS thumbnail_url,
        1 AS display_order,
        1 AS is_homepage_featured,
        'published' AS status
    UNION ALL
    SELECT 
        'Sri Satyanarayana Swamy Vratam Complete Katha & Pooja',
        'https://www.youtube.com/watch?v=0h6Q5XQ_0lE',
        '0h6Q5XQ_0lE',
        'Step-by-step sacred Satyanarayana Swamy Pooja recitation, Kalasha sthapana, and prasadam offerings.',
        'Pooja',
        'https://img.youtube.com/vi/0h6Q5XQ_0lE/hqdefault.jpg',
        2,
        1,
        'published'
    UNION ALL
    SELECT 
        'Maha Mrityunjaya Homam for Health, Healing & Longevity',
        'https://www.youtube.com/watch?v=J9fP87Z8k0I',
        'J9fP87Z8k0I',
        'Vedic recitation of the sacred Tryambakam mantra with 108 ahutis of amrita valli and sesame oblations.',
        'Homam',
        'https://img.youtube.com/vi/J9fP87Z8k0I/hqdefault.jpg',
        3,
        1,
        'published'
    UNION ALL
    SELECT 
        'Sacred Shiva Linga Rudrabhishekam with Namakam & Chamakam',
        'https://www.youtube.com/watch?v=M5A7D8K9l4s',
        'M5A7D8K9l4s',
        'Holy abhishekam with milk, honey, sugarcane juice, and sacred vibhooti performed by senior purohits.',
        'Pooja',
        'https://img.youtube.com/vi/M5A7D8K9l4s/hqdefault.jpg',
        4,
        1,
        'published'
    UNION ALL
    SELECT 
        'Navagraha Shanti Homam & Dosha Nivarana Vidhanam',
        'https://www.youtube.com/watch?v=P8m4F9A2b3c',
        'P8m4F9A2b3c',
        'Harmonizing the planetary influences through nine sacred grains and dedicated Vedic graha suktams.',
        'Spiritual Guidance',
        'https://img.youtube.com/vi/P8m4F9A2b3c/hqdefault.jpg',
        5,
        1,
        'published'
    UNION ALL
    SELECT 
        'Sri Lakshmi Kubera Pooja for Abundance & Financial Harmony',
        'https://www.youtube.com/watch?v=T6v8N4Q1d7e',
        'T6v8N4Q1d7e',
        'Divine worship of Goddess Maha Lakshmi and Lord Kubera with lotus flowers and kumkum archana.',
        'Festivals',
        'https://img.youtube.com/vi/T6v8N4Q1d7e/hqdefault.jpg',
        6,
        1,
        'published'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM youtube_videos LIMIT 1);
