
<?php
require_once '../config.php';

try {
    echo "<h2>Database Debug Information</h2>";
    
    $pdo = getDbConnection();
    echo "<p>✅ Database connection successful</p>";
    
    // Check if tables exist
    $tables = ['feedback', 'feedback_issues', 'feedback_images', 'customer_rewards'];
    
    foreach ($tables as $table) {
        echo "<h3>Table: $table</h3>";
        
        try {
            // Check if table exists
            $stmt = $pdo->prepare("SHOW TABLES LIKE '$table'");
            $stmt->execute();
            $exists = $stmt->fetch();
            
            if ($exists) {
                echo "<p>✅ Table exists</p>";
                
                // Show table structure
                $stmt = $pdo->prepare("DESCRIBE $table");
                $stmt->execute();
                $columns = $stmt->fetchAll();
                
                echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
                echo "<tr><th>Column</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
                foreach ($columns as $column) {
                    echo "<tr>";
                    echo "<td>{$column['Field']}</td>";
                    echo "<td>{$column['Type']}</td>";
                    echo "<td>{$column['Null']}</td>";
                    echo "<td>{$column['Key']}</td>";
                    echo "<td>{$column['Default']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
                
                // Show row count
                $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM $table");
                $stmt->execute();
                $count = $stmt->fetch()['count'];
                echo "<p>Row count: $count</p>";
                
                // Show latest entries
                if ($count > 0) {
                    $stmt = $pdo->prepare("SELECT * FROM $table ORDER BY id DESC LIMIT 3");
                    $stmt->execute();
                    $rows = $stmt->fetchAll();
                    
                    echo "<h4>Latest entries:</h4>";
                    echo "<pre>" . json_encode($rows, JSON_PRETTY_PRINT) . "</pre>";
                }
                
            } else {
                echo "<p>❌ Table does not exist</p>";
            }
            
        } catch (Exception $e) {
            echo "<p>❌ Error checking table: " . $e->getMessage() . "</p>";
        }
        
        echo "<hr>";
    }
    
} catch (Exception $e) {
    echo "<p>❌ Database connection failed: " . $e->getMessage() . "</p>";
}
?>
