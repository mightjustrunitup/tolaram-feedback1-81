
<?php
/**
 * Automated Database Setup Script for WAMP
 * This script will automatically create the database and tables when first accessed
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database configuration for WAMP/MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'feedback_app');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default WAMP MySQL password is empty

function createDatabase() {
    try {
        // Connect to MySQL without specifying database
        $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
        $pdo->exec("USE " . DB_NAME);
        
        // Create tables
        $sql = "
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

        -- Feedback issues table
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

        -- Customer rewards table
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

        -- Scanned products table
        CREATE TABLE IF NOT EXISTS scanned_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NULL,
            product_id VARCHAR(100) NOT NULL,
            barcode_data TEXT NOT NULL,
            image_url TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ";
        
        // Execute the SQL
        $pdo->exec($sql);
        
        // Create a setup completion marker
        file_put_contents(__DIR__ . '/setup_complete.txt', date('Y-m-d H:i:s'));
        
        return [
            'success' => true,
            'message' => 'Database and tables created successfully',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Setup failed: ' . $e->getMessage(),
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}

// Check if setup has already been completed
if (file_exists(__DIR__ . '/setup_complete.txt')) {
    echo json_encode([
        'success' => true,
        'message' => 'Database already set up',
        'setup_date' => file_get_contents(__DIR__ . '/setup_complete.txt'),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    // Run setup
    $result = createDatabase();
    echo json_encode($result);
}
?>
