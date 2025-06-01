
<?php
require_once '../config.php';

try {
    $pdo = getDbConnection();
    
    // Get complete feedback with issues and images
    $stmt = $pdo->prepare("
        SELECT 
            f.id,
            f.created_at,
            f.updated_at,
            f.customer_name,
            f.location,
            f.product_id,
            f.variant_id,
            f.comments,
            GROUP_CONCAT(DISTINCT fi.issue) as issues,
            GROUP_CONCAT(DISTINCT img.image_url) as images
        FROM feedback f
        LEFT JOIN feedback_issues fi ON f.id = fi.feedback_id
        LEFT JOIN feedback_images img ON f.id = img.feedback_id
        GROUP BY f.id
        ORDER BY f.created_at DESC
    ");
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the results
    $formattedResults = array_map(function($row) {
        return [
            'id' => $row['id'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
            'customer_name' => $row['customer_name'],
            'location' => $row['location'],
            'product_id' => $row['product_id'],
            'variant_id' => $row['variant_id'],
            'comments' => $row['comments'],
            'issues' => $row['issues'] ? explode(',', $row['issues']) : [],
            'images' => $row['images'] ? explode(',', $row['images']) : []
        ];
    }, $results);
    
    sendResponse($formattedResults);
    
} catch (Exception $e) {
    error_log("Error fetching feedback: " . $e->getMessage());
    handleError('Failed to fetch feedback');
}
?>
