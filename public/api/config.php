
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

// Create database connection
function getDbConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        throw new Exception("Database connection failed: " . $e->getMessage());
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
    
    default:
        handleError('Endpoint not found', 404);
}
?>
