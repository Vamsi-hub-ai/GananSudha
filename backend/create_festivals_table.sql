-- =========================================================================
-- GNANA SUDHA FESTIVAL CALENDAR TABLE MIGRATION
-- Stores verified Hindu festivals with Telugu and English metadata
-- =========================================================================

CREATE TABLE IF NOT EXISTS festivals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    festival_key VARCHAR(100) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    day_te VARCHAR(50) NOT NULL,
    day_en VARCHAR(50) NOT NULL,
    category ENUM('major', 'vrata', 'jayanti', 'tithi', 'regional') DEFAULT 'major',
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
);
