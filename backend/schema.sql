CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NULL,
    `desc` TEXT NULL,
    image VARCHAR(1024) NULL,
    iconname VARCHAR(50) DEFAULT 'Box',
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NULL,
    slug VARCHAR(255) NULL,
    `desc` TEXT,
    desc_te TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    `oldPrice` DECIMAL(10, 2),
    categoryid INT,
    sku VARCHAR(100) NULL,
    stock INT DEFAULT 50,
    rating DECIMAL(3, 1) DEFAULT 4.8,
    reviews INT DEFAULT 0,
    badge_text VARCHAR(50) NULL,
    badge_type VARCHAR(50) NULL,
    image VARCHAR(1024) NULL,
    images JSON NULL,
    variants JSON NULL,
    highlights TEXT NULL,
    usage_instructions TEXT NULL,
    specifications TEXT NULL,
    featured BOOLEAN DEFAULT 0,
    bestseller BOOLEAN DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS poojas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    `desc` TEXT,
    price DECIMAL(10, 2),
    `discountPrice` DECIMAL(10, 2),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    `desc` TEXT,
    price DECIMAL(10, 2),
    `discountPrice` DECIMAL(10, 2),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pandits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(255),
    rating VARCHAR(10) DEFAULT '5.0',
    reviews VARCHAR(10) DEFAULT '0',
    status VARCHAR(50) DEFAULT 'Pending',
    gender VARCHAR(20) DEFAULT 'male',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NULL,
    customerid INT,
    status VARCHAR(50) DEFAULT 'Confirmed',
    items JSON NOT NULL,
    subtotal DECIMAL(10, 2) NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `paymentMethod` VARCHAR(50) DEFAULT 'Cash on Delivery',
    paymentStatus VARCHAR(50) DEFAULT 'Pending',
    paymentId VARCHAR(255) NULL,
    `shippingDetails` JSON,
    tracking_number VARCHAR(100) NULL,
    courier_name VARCHAR(100) NULL,
    estimated_delivery VARCHAR(100) NULL,
    notes TEXT NULL,
    FOREIGN KEY (customerid) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    min_order_value DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2) NULL,
    expiry DATE,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NULL,
    rating INT NOT NULL DEFAULT 5,
    review_title VARCHAR(255) NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    change_amount INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    reference_id VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image_path VARCHAR(1024) NOT NULL,
    mobile_image_path VARCHAR(1024) NULL,
    alt_text VARCHAR(255) NULL,
    cta_text VARCHAR(100) NULL,
    cta_url VARCHAR(1024) NULL,
    display_order INT NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    start_at DATETIME NULL,
    end_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Admin
INSERT IGNORE INTO admin_users (username, password, name) 
VALUES ('admin', 'password', 'Admin User'),
       ('Gnanasudha18@gmail.com', 'GnanaSudha@336', 'Gnana Sudha Admin');

-- Insert Default Customer
INSERT IGNORE INTO customers (name, email, password)
VALUES ('Vamsi', 'Vamsipallela31@gmail.com', 'Vamsi@123');

-- Insert Default Consultations
INSERT IGNORE INTO consultations (id, title, price, `discountPrice`) VALUES
('muhurtam', 'Muhurtam', 1000, 900),
('vaastu', 'Vaastu Consultation', 1000, 900),
('horoscope', 'Horoscope Reading', 1000, 900),
('pooja', 'Book Pandit & Pooja', 1000, 900);

-- Insert Default Categories
INSERT IGNORE INTO categories (id, name, slug, `desc`, image, iconname, display_order, status) VALUES
(1, 'Pooja Kits', 'pooja-kits', 'Complete, curated pooja kits for every sacred ritual and deity ceremony.', '/assets/product_pooja_kit.png', 'Box', 1, 'active'),
(2, 'Homam Samagri', 'homam-samagri', '108 pure shastra-compliant herbs, woods and offerings for holy havans.', '/assets/product_pooja_kit.png', 'Flame', 2, 'active'),
(3, 'Incense & Dhoop', 'incense-dhoop', 'Hand-rolled, temple-grade natural incense sticks and organic dhoop cups.', '/assets/product_pooja_kit.png', 'Sparkles', 3, 'active'),
(4, 'Diyas & Brass Lamps', 'diyas-lamps', 'Traditional brass akhand diyas, deepams and decorative brass lamps.', '/assets/product_pooja_kit.png', 'Flame', 4, 'active'),
(5, 'Kumkum & Chandan', 'kumkum-chandan', 'Original pure turmeric kumkum, Mysore sandal paste and ashtagandha.', '/assets/product_pooja_kit.png', 'Tag', 5, 'active'),
(6, 'Idols & Sacred Decor', 'idols-decor', 'Spiritual brass and panchaloha murthis, yantras and altar decor.', '/assets/product_pooja_kit.png', 'LayoutGrid', 6, 'active'),
(7, 'Rudraksha & Malas', 'rudraksha-malas', 'Lab-tested genuine Nepal & Java Rudraksha beads and japa malas.', '/assets/product_pooja_kit.png', 'Grid', 7, 'active'),
(8, 'Festival Essentials', 'festival-essentials', 'Special festive hampers and seasonal ritual essentials for all celebrations.', '/assets/product_pooja_kit.png', 'Book', 8, 'active');

-- Insert Default Products
INSERT IGNORE INTO products (id, name, slug, `desc`, price, `oldPrice`, categoryid, sku, stock, rating, reviews, badge_text, badge_type, image, images, variants, highlights, usage_instructions, specifications, featured, bestseller, status) VALUES
(1, 'Sampoorna Satyanarayana Swamy Pooja Kit', 'sampoorna-satyanarayana-pooja-kit', 'Complete authentic ritual box containing 32+ essential items including pure turmeric, kumkum, sacred yellow cloth, panchamrut samagri, batti, and vrat katha book.', 999.00, 1299.00, 1, 'PK-SATYA-01', 45, 4.9, 128, 'Best Seller', 'bestseller', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png", "/assets/product_pooja_kit.png"]', '[{"attribute": "Standard Kit (32 items)", "price": 999, "stock": 30, "sku": "PK-SAT-STD"}, {"attribute": "Deluxe Brass Thali Kit", "price": 1699, "stock": 15, "sku": "PK-SAT-DLX"}]', '100% Shastra Compliant; Sealed tamper-proof packaging; Includes authentic Vrat Katha; Sourced directly from holy temples', 'Unbox on a clean sacred chowki; Follow the step-by-step checklist provided in the box.', 'Weight: 1.5 kg; Shelf Life: 12 months; Country of Origin: India', 1, 1, 'active'),
(2, 'Pure Vedic Cow Ghee Diya Wicks (Pack of 100)', 'pure-cow-ghee-diya-wicks-100', 'Pre-soaked pure indigenous cow ghee cotton wicks infused with gentle camphor and sandalwood fragrance for effortless daily altar lighting.', 299.00, 399.00, 4, 'DY-GHEE-100', 85, 4.8, 94, 'Popular', 'popular', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png"]', '[{"attribute": "Pack of 100", "price": 299, "stock": 50, "sku": "DY-GH-100"}, {"attribute": "Pack of 200 (Value Saver)", "price": 549, "stock": 35, "sku": "DY-GH-200"}]', 'No wax or paraffin; Burns cleanly for 30+ minutes; Releases divine aroma; Suitable for Akhand deepam', 'Place one wick directly in a diya lamp and light with matchstick. No extra ghee required.', 'Quantity: 100 wicks; Storage: Cool dry place; Base: 100% Desi Cow Ghee', 1, 0, 'active'),
(3, 'Authentic Ashtagandha Chandan & Roli Kumkum Set', 'authentic-ashtagandha-chandan-kumkum-set', 'Traditional temple-grade fragrance paste set made from 8 sacred herbs combined with natural turmeric roli kumkum for daily tilak.', 199.00, 249.00, 5, 'KC-ASHTA-01', 120, 4.9, 83, 'Natural', 'natural', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png"]', '[{"attribute": "50g Combo Jar", "price": 199, "stock": 70, "sku": "KC-ASH-50"}, {"attribute": "100g Combo Jar", "price": 349, "stock": 50, "sku": "KC-ASH-100"}]', '100% skin safe; Non-allergic natural herbs; Traditional fragrance; Long lasting tilak brightness', 'Mix with a drop of Ganga jal or rose water and apply to the forehead/deity.', 'Pack Includes: 1x Chandan Paste (50g), 1x Kumkum (50g)', 0, 1, 'active'),
(4, 'Sacred Hawan Samagri with 108 Rare Vedic Herbs', 'sacred-hawan-samagri-108-herbs', 'Premium shastra-formulated hawan mixture containing Guggal, Jatamansi, Nagarmotha, Kamal Gatta, Agar-Tagar, and organic dry fruits.', 349.00, 449.00, 2, 'HW-SAM-350', 65, 4.9, 67, '108 Herbs', 'special', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png"]', '[{"attribute": "350g Pouch", "price": 349, "stock": 35, "sku": "HW-350"}, {"attribute": "700g Eco Box", "price": 649, "stock": 20, "sku": "HW-700"}, {"attribute": "1 kg Bulk Pack", "price": 899, "stock": 10, "sku": "HW-1000"}]', 'Contains zero saw-dust; 108 authentic Ayurvedic herbs; Pure air purifying properties; Creates sacred positive energy', 'Offer into the consecrated agni kund during mantra chanting.', 'Net Weight: 350g / 700g / 1kg; Ingredients: 108 Ayurvedic medicinal woods & herbs', 1, 1, 'active'),
(5, 'Handcrafted Pure Brass Panchawala Diya', 'handcrafted-pure-brass-panchawala-diya', 'Master artisan crafted five-face traditional brass diya with peacock finial and sturdy weighted base, ideal for daily Aarti and Lakshmi pooja.', 699.00, 899.00, 4, 'DY-BRASS-5F', 32, 4.8, 41, 'Handmade', 'handcrafted', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png"]', '[{"attribute": "Medium (6 inch)", "price": 699, "stock": 20, "sku": "DY-BR-M"}, {"attribute": "Large (8.5 inch)", "price": 1099, "stock": 12, "sku": "DY-BR-L"}]', 'Virgin heavy-gauge brass; Golden glossy lacquer polish; 5 wick notches for Pancha Aarti; Easy to clean', 'Wash with mild tamarind/lemon paste or brass polish to retain gleam.', 'Material: 100% Solid Brass; Weight: 420g; Height: 6 inches', 1, 0, 'active'),
(6, 'Certified 5-Mukhi Indonesian Rudraksha Japa Mala', 'certified-5-mukhi-rudraksha-japa-mala', 'Natural 5-mukhi small 7mm Rudraksha beads strung in traditional knotting with tassel for Lord Shiva japa chanting and personal protection.', 1299.00, 1799.00, 7, 'RD-5M-MALA', 28, 4.9, 52, 'Lab Certified', 'certified', '/assets/product_pooja_kit.png', '["/assets/product_pooja_kit.png"]', '[{"attribute": "7mm Beads (108+1)", "price": 1299, "stock": 18, "sku": "RD-7MM"}, {"attribute": "8mm Beads with Silver Capping", "price": 2499, "stock": 10, "sku": "RD-8MM-SILVER"}]', 'Comes with X-Ray authenticity certificate; Purified & energized with Shiva mantras; Ideal for Gayatri and Mahamrityunjaya japa', 'Wear after morning bath or hold between thumb and ring finger while chanting.', 'Bead Count: 108+1 Guru Bead; Bead Size: ~7mm; Origin: Indonesia', 1, 1, 'active');

-- Insert Default Coupons
INSERT IGNORE INTO coupons (id, code, discount, discount_type, min_order_value, max_discount, expiry, usage_limit, used_count, status) VALUES
(1, 'DIVINE10', 10.00, 'percentage', 499.00, 200.00, '2028-12-31', 500, 14, 'active'),
(2, 'FESTIVE20', 20.00, 'percentage', 999.00, 500.00, '2028-12-31', 200, 8, 'active'),
(3, 'WELCOME100', 100.00, 'fixed', 799.00, 100.00, '2028-12-31', 1000, 23, 'active');

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

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    service_id INT NULL,
    service_type ENUM('pooja', 'homam', 'consultation', 'custom') DEFAULT 'pooja',
    service_name VARCHAR(255) NOT NULL,
    customer_id INT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(100) NULL,
    service_location ENUM('Home', 'Temple', 'Function Hall', 'Other') DEFAULT 'Home',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    preferred_language VARCHAR(50) DEFAULT 'Telugu',
    additional_requirements TEXT NULL,
    special_instructions TEXT NULL,
    status ENUM('Pending Review', 'Awaiting Customer Confirmation', 'Confirmed', 'Pandit Assigned', 'In Progress', 'Completed', 'Cancelled', 'Rejected') DEFAULT 'Pending Review',
    assigned_pandit_id INT NULL,
    assigned_pandit_name VARCHAR(255) NULL,
    admin_notes TEXT NULL,
    cancellation_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_booking_id (booking_id),
    INDEX idx_booking_status (status),
    INDEX idx_booking_date (preferred_date),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS pandit_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pandit_id INT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '06:00:00',
    end_time TIME NOT NULL DEFAULT '21:00:00',
    status ENUM('available', 'unavailable', 'leave') DEFAULT 'available',
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pandit_date (pandit_id, available_date),
    INDEX idx_avail_status (status)
);

CREATE TABLE IF NOT EXISTS task_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_reference VARCHAR(50) UNIQUE NOT NULL,
    booking_id INT NULL,
    pandit_id INT NOT NULL,
    ritual_name VARCHAR(255) NOT NULL,
    service_type ENUM('pooja', 'homam', 'consultation', 'custom') DEFAULT 'pooja',
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NULL,
    scheduled_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    duration_minutes INT DEFAULT 150,
    buffer_minutes INT DEFAULT 45,
    service_location VARCHAR(100) DEFAULT 'Home',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    preferred_language VARCHAR(50) DEFAULT 'Telugu',
    status ENUM('Assigned', 'In Progress', 'Completed', 'Rescheduled', 'Cancelled') DEFAULT 'Assigned',
    special_instructions TEXT NULL,
    assigned_by VARCHAR(100) DEFAULT 'Gnana Sudha Admin',
    cancellation_reason TEXT NULL,
    cancelled_at DATETIME NULL,
    cancelled_by VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_task_ref (task_reference),
    INDEX idx_pandit_schedule (pandit_id, scheduled_date),
    INDEX idx_task_status (status)
);

CREATE TABLE IF NOT EXISTS whatsapp_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_reference VARCHAR(50) NOT NULL,
    task_id INT NULL,
    recipient_pandit_id INT NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    event_type ENUM('TASK_ASSIGNED', 'TASK_RESCHEDULED', 'TASK_CANCELLED', 'TASK_REASSIGNED', 'SCHEDULE_UPDATE', 'TEST_MESSAGE') NOT NULL,
    template_name VARCHAR(100) DEFAULT 'pandit_task_assignment',
    template_language VARCHAR(10) DEFAULT 'en_US',
    template_parameters JSON NULL,
    message_body TEXT NOT NULL,
    api_message_id VARCHAR(255) NULL,
    delivery_status ENUM('QUEUED', 'PENDING', 'PROCESSING', 'ACCEPTED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED', 'NOT_CONFIGURED') DEFAULT 'QUEUED',
    attempt_count INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    next_retry_at DATETIME NULL,
    idempotency_key VARCHAR(191) NULL UNIQUE,
    error_code VARCHAR(50) NULL,
    last_error TEXT NULL,
    response_payload JSON NULL,
    sent_at DATETIME NULL,
    delivered_at DATETIME NULL,
    read_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_notif_task (task_reference),
    INDEX idx_notif_status (delivery_status),
    INDEX idx_notif_pandit (recipient_pandit_id),
    INDEX idx_notif_api_id (api_message_id),
    INDEX idx_notif_retry (delivery_status, next_retry_at)
);

CREATE TABLE IF NOT EXISTS task_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_reference VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    change_reason TEXT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_history_task (task_reference)
);

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
