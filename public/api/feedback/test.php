
<?php
require_once '../config.php';

try {
    $pdo = getDbConnection();
    
    // Test database connection and return table info
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    sendResponse([
        'success' => true,
        'message' => 'Database connection successful',
        'tables' => $tables,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    error_log("Database test failed: " . $e->getMessage());
    handleError('Database test failed: ' . $e->getMessage());
}
?>
