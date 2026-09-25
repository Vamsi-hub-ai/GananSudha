CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "desc" TEXT,
    price DECIMAL(10, 2) NOT NULL,
    "oldPrice" DECIMAL(10, 2),
    categoryid INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poojas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "desc" TEXT,
    price DECIMAL(10, 2),
    "discountPrice" DECIMAL(10, 2),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "desc" TEXT,
    price DECIMAL(10, 2),
    "discountPrice" DECIMAL(10, 2),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pandits (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    customerid INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    items JSONB NOT NULL,
    "totalAmount" DECIMAL(10, 2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" VARCHAR(50),
    "shippingDetails" JSONB
);

CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    expiry DATE
);

CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    "discountPrice" DECIMAL(10, 2)
);

-- Insert Default Admin
INSERT INTO admin_users (username, password, name) 
VALUES ('admin', 'password', 'Admin User') 
ON CONFLICT DO NOTHING;

-- Insert Default Consultations
INSERT INTO consultations (id, title, price, "discountPrice") VALUES
('muhurtam', 'Muhurtam', 1000, 900),
('vaastu', 'Vaastu Consultation', 1000, 900),
('horoscope', 'Horoscope Reading', 1000, 900),
('pooja', 'Book Pandit & Pooja', 1000, 900)
ON CONFLICT (id) DO NOTHING;
