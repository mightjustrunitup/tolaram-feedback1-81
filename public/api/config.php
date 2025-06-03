
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

// Auto-setup check - run setup if not completed
function checkAndRunSetup() {
    if (!file_exists(__DIR__ . '/setup_complete.txt')) {
        // Include and run setup
        $setupResult = include_once 'setup.php';
        // Give a moment for setup to complete
        usleep(500000); // 0.5 seconds
    }
}

// Create database connection
function getDbConnection() {
    // Check if setup is needed
    checkAndRunSetup();
    
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        // If connection fails, try to run setup again
        checkAndRunSetup();
        
        // Try connection again
        try {
            $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch(PDOException $e2) {
            throw new Exception("Database connection failed even after setup: " . $e2->getMessage());
        }
    }
}

// Utility function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Utility function to handle errors
function handleError($message, $status = 500) {
    sendResponse(['error' => true, 'message' => $message], $status);
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Route the request
switch ($path) {
    case '/feedback':
        if ($method === 'POST') {
            require_once 'feedback/submit.php';
        } elseif ($method === 'GET') {
            require_once 'feedback/list.php';
        } else {
            handleError('Method not allowed', 405);
        }
        break;
    
    case '/feedback/test':
        if ($method === 'GET') {
            require_once 'feedback/test.php';
        } else {
            handleError('Method not allowed', 405);
        }
        break;
    
    case '/setup':
        if ($method === 'GET') {
            require_once 'setup.php';
        } else {
            handleError('Method not allowed', 405);
        }
        break;
    
    default:
        handleError('Endpoint not found', 404);
}
?>
