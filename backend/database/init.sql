-- GoSulawesi Database Schema
CREATE DATABASE IF NOT EXISTS gosulawesi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gosulawesi;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','tourist','local') NOT NULL DEFAULT 'tourist',
    avatar VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Businesses table (for local role)
CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) DEFAULT NULL,
    nib VARCHAR(50) DEFAULT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0.0,
    price DECIMAL(10,2) DEFAULT 0.00,
    latitude DECIMAL(10,7) DEFAULT NULL,
    longitude DECIMAL(10,7) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (tourist bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT DEFAULT NULL,
    business_id INT DEFAULT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    total_price DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT DEFAULT NULL,
    business_id INT DEFAULT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Insert default admin
INSERT INTO users (name, email, password, role) VALUES
('Admin GoSulawesi', 'admin@gosulawesi.id', '$2y$10$N9qo8uLOickgx2ZMRZoMy.MQDq/1WZjKkQz8K3mFQoqWmFQoqWmFq', 'admin');

-- Insert sample destinations
INSERT INTO destinations (name, city, category, description, image_url, rating, price) VALUES
('Bunaken Marine Park', 'Manado', 'Diving', 'World-class diving and snorkeling with stunning coral walls and diverse marine life.', '/img/Danau Tanralili.jpg', 4.9, 350000),
('Tana Toraja', 'Makassar', 'Cultural', 'Unique funeral rituals, traditional houses (Tongkonan) and breathtaking highland landscapes.', '/img/Mappaccing Ceremony.jpg', 4.8, 250000),
('Wakatobi Islands', 'Kendari', 'Diving', 'Pristine islands with some of the best coral reefs in the world.', '/img/Bungung Salapang.webp', 4.9, 500000),
('Lake Tondano', 'Tondano', 'Nature', 'Beautiful volcanic lake surrounded by mountains and flower gardens.', '/img/Air Terjun Depa.jpeg', 4.5, 100000),
('Bantimurung Park', 'Makassar', 'Nature', 'Waterfalls, butterfly conservation and limestone caves.', '/img/Desa_Bonto_Manai.jpg', 4.6, 75000),
('Tomohon Market', 'Tomohon', 'Cultural', 'Traditional market famous for exotic local foods and flowers.', '/img/Menre'' ri Lontang.jpg', 4.3, 50000);
