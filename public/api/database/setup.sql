
-- Database setup for WAMP MySQL
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS feedback_app;
USE feedback_app;

-- Main feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NULL,
    location TEXT NULL,
    product_id VARCHAR(100) NOT NULL,
    variant_id VARCHAR(100) NOT NULL,
    comments TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedback issues table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS feedback_issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT NOT NULL,
    issue TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Feedback images table
CREATE TABLE IF NOT EXISTS feedback_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Optional: Customer rewards table
CREATE TABLE IF NOT EXISTS customer_rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT NULL,
    customer_name VARCHAR(255) NULL,
    phone VARCHAR(20) NOT NULL,
    location TEXT NULL,
    coordinates JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE SET NULL
);

-- Optional: Scanned products table
CREATE TABLE IF NOT EXISTS scanned_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NULL,
    product_id VARCHAR(100) NOT NULL,
    barcode_data TEXT NOT NULL,
    image_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create view for complete feedback (similar to Supabase view)
CREATE VIEW complete_feedback AS
SELECT 
    f.id,
    f.created_at,
    f.updated_at,
    f.customer_name,
    f.location,
    f.product_id,
    f.variant_id,
    f.comments,
    CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', fi.issue, '"') SEPARATOR ','), ']') as issues,
    CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', img.image_url, '"') SEPARATOR ','), ']') as images
FROM feedback f
LEFT JOIN feedback_issues fi ON f.id = fi.feedback_id
LEFT JOIN feedback_images img ON f.id = img.feedback_id
GROUP BY f.id, f.created_at, f.updated_at, f.customer_name, f.location, f.product_id, f.variant_id, f.comments;
