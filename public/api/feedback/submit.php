
<?php
require_once '../config.php';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        handleError('Invalid JSON input', 400);
    }
    
    // Validate required fields
    if (empty($input['productId']) || empty($input['variantId'])) {
        handleError('Product ID and Variant ID are required', 400);
    }
    
    // Get database connection
    $pdo = getDbConnection();
    
    // Begin transaction
    $pdo->beginTransaction();
    
    try {
        // Insert main feedback record
        $stmt = $pdo->prepare("
            INSERT INTO feedback (customer_name, location, product_id, variant_id, comments, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $input['customerName'] ?? null,
            $input['location'] ?? null,
            $input['productId'],
            $input['variantId'],
            $input['comments'] ?? null
        ]);
        
        $feedbackId = $pdo->lastInsertId();
        
        // Insert issues if provided
        if (!empty($input['issues']) && is_array($input['issues'])) {
            $issueStmt = $pdo->prepare("INSERT INTO feedback_issues (feedback_id, issue) VALUES (?, ?)");
            foreach ($input['issues'] as $issue) {
                $issueStmt->execute([$feedbackId, $issue]);
            }
        }
        
        // Handle base64 image uploads if provided
        if (!empty($input['images']) && is_array($input['images'])) {
            $imageStmt = $pdo->prepare("INSERT INTO feedback_images (feedback_id, image_url) VALUES (?, ?)");
            
            // Create uploads directory if it doesn't exist
            $uploadDir = '../../lovable-uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            foreach ($input['images'] as $index => $base64Image) {
                // Extract base64 data and save as file
                if (preg_match('/^data:image\/(\w+);base64,(.*)$/', $base64Image, $matches)) {
                    $imageType = $matches[1]; // jpg, png, etc.
                    $imageData = base64_decode($matches[2]);
                    
                    // Generate unique filename
                    $filename = $feedbackId . '_' . time() . '_' . $index . '.' . $imageType;
                    $filePath = $uploadDir . $filename;
                    
                    // Save file
                    if (file_put_contents($filePath, $imageData)) {
                        // Store the relative URL in database
                        $imageUrl = '/lovable-uploads/' . $filename;
                        $imageStmt->execute([$feedbackId, $imageUrl]);
                    }
                }
            }
        }
        
        // Handle coordinates if provided
        if (!empty($input['coordinates'])) {
            // You can store coordinates in a separate table or as JSON in the feedback table
            // For now, let's update the location with coordinates info
            $coordsInfo = "Lat: " . $input['coordinates']['latitude'] . ", Lng: " . $input['coordinates']['longitude'];
            if (empty($input['location'])) {
                $updateStmt = $pdo->prepare("UPDATE feedback SET location = ? WHERE id = ?");
                $updateStmt->execute([$coordsInfo, $feedbackId]);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        
        // Return success response
        sendResponse([
            'submitted' => true,
            'id' => $feedbackId,
            'message' => 'Feedback submitted successfully'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Error submitting feedback: " . $e->getMessage());
    handleError('Failed to submit feedback: ' . $e->getMessage());
}
?>
