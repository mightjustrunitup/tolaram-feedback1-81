
<?php
// Set proper headers first
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
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
        try {
            // Include and run setup
            $setupResult = include_once __DIR__ . '/setup.php';
            // Give a moment for setup to complete
            usleep(500000); // 0.5 seconds
        } catch (Exception $e) {
            error_log("Setup failed: " . $e->getMessage());
        }
    }
}

// Create database connection
function getDbConnection() {
    // Check if setup is needed
    checkAndRunSetup();
    
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch(PDOException $e) {
        // If connection fails, try to run setup again
        checkAndRunSetup();
        
        // Try connection again
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            return $pdo;
        } catch(PDOException $e2) {
            error_log("Database connection failed: " . $e2->getMessage());
            throw new Exception("Database connection failed: " . $e2->getMessage());
        }
    }
}

// Utility function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Utility function to handle errors
function handleError($message, $status = 500) {
    error_log("API Error: " . $message);
    sendResponse(['error' => true, 'message' => $message], $status);
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove /api prefix if present
if (strpos($path, '/api') === 0) {
    $path = substr($path, 4);
}

// Ensure path starts with /
if (empty($path) || $path[0] !== '/') {
    $path = '/' . $path;
}

// Route the request
try {
    switch ($path) {
        case '/feedback':
            if ($method === 'POST') {
                require_once __DIR__ . '/feedback/submit.php';
            } elseif ($method === 'GET') {
                require_once __DIR__ . '/feedback/list.php';
            } else {
                handleError('Method not allowed', 405);
            }
            break;
        
        case '/feedback/test':
            if ($method === 'GET') {
                require_once __DIR__ . '/feedback/test.php';
            } else {
                handleError('Method not allowed', 405);
            }
            break;
        
        case '/setup':
            if ($method === 'GET') {
                require_once __DIR__ . '/setup.php';
            } else {
                handleError('Method not allowed', 405);
            }
            break;
        
        default:
            handleError('Endpoint not found: ' . $path, 404);
    }
} catch (Exception $e) {
    error_log("Route handling error: " . $e->getMessage());
    handleError('Internal server error: ' . $e->getMessage(), 500);
}
?>
