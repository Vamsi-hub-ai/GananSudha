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
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    `desc` TEXT,
    price DECIMAL(10, 2) NOT NULL,
    `oldPrice` DECIMAL(10, 2),
    categoryid INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    customerid INT,
    status VARCHAR(50) DEFAULT 'Confirmed',
    items JSON NOT NULL,
    `totalAmount` DECIMAL(10, 2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `paymentMethod` VARCHAR(50),
    `shippingDetails` JSON,
    FOREIGN KEY (customerid) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    expiry DATE
);

CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2)
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
