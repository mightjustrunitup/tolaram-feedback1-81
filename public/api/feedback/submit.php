
<?php
require_once '../config.php';

// Add detailed logging
error_log("=== FEEDBACK SUBMIT REQUEST START ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request URI: " . $_SERVER['REQUEST_URI']);

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log("Raw input received: " . file_get_contents('php://input'));
    error_log("Decoded input: " . json_encode($input));
    
    if (!$input) {
        error_log("ERROR: Invalid JSON input");
        handleError('Invalid JSON input', 400);
    }
    
    // Validate required fields
    if (empty($input['productId']) || empty($input['variantId'])) {
        error_log("ERROR: Missing required fields - productId: " . ($input['productId'] ?? 'null') . ", variantId: " . ($input['variantId'] ?? 'null'));
        handleError('Product ID and Variant ID are required', 400);
    }
    
    error_log("Validation passed, attempting database connection...");
    
    // Get database connection
    $pdo = getDbConnection();
    error_log("Database connection successful");
    
    // Begin transaction
    $pdo->beginTransaction();
    error_log("Transaction started");
    
    try {
        // Insert main feedback record
        $stmt = $pdo->prepare("
            INSERT INTO feedback (customer_name, location, product_id, variant_id, comments, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $feedbackData = [
            $input['customerName'] ?? null,
            $input['location'] ?? null,
            $input['productId'],
            $input['variantId'],
            $input['comments'] ?? null
        ];
        
        error_log("Inserting feedback with data: " . json_encode($feedbackData));
        
        $stmt->execute($feedbackData);
        
        $feedbackId = $pdo->lastInsertId();
        error_log("Feedback inserted successfully with ID: " . $feedbackId);
        
        // Insert issues if provided
        if (!empty($input['issues']) && is_array($input['issues'])) {
            error_log("Inserting " . count($input['issues']) . " issues");
            $issueStmt = $pdo->prepare("INSERT INTO feedback_issues (feedback_id, issue) VALUES (?, ?)");
            foreach ($input['issues'] as $issue) {
                $issueStmt->execute([$feedbackId, $issue]);
                error_log("Issue inserted: " . $issue);
            }
        }
        
        // Handle base64 image uploads if provided
        if (!empty($input['images']) && is_array($input['images'])) {
            error_log("Processing " . count($input['images']) . " images");
            $imageStmt = $pdo->prepare("INSERT INTO feedback_images (feedback_id, image_url) VALUES (?, ?)");
            
            // Create uploads directory if it doesn't exist
            $uploadDir = '../../lovable-uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
                error_log("Created upload directory: " . $uploadDir);
            }
            
            foreach ($input['images'] as $index => $base64Image) {
                // Extract base64 data and save as file
                if (preg_match('/^data:image\/(\w+);base64,(.*)$/', $base64Image, $matches)) {
                    $imageType = $matches[1]; // jpg, png, etc.
                    $imageData = base64_decode($matches[2]);
                    
                    // Generate unique filename
                    $filename = $feedbackId . '_' . time() . '_' . $index . '.' . $imageType;
                    $filePath = $uploadDir . $filename;
                    
                    error_log("Saving image: " . $filename);
                    
                    // Save file
                    if (file_put_contents($filePath, $imageData)) {
                        // Store the relative URL in database
                        $imageUrl = '/lovable-uploads/' . $filename;
                        $imageStmt->execute([$feedbackId, $imageUrl]);
                        error_log("Image saved and URL stored: " . $imageUrl);
                    } else {
                        error_log("Failed to save image: " . $filename);
                    }
                } else {
                    error_log("Invalid base64 image format at index: " . $index);
                }
            }
        }
        
        // Handle coordinates if provided
        if (!empty($input['coordinates'])) {
            error_log("Processing coordinates: " . json_encode($input['coordinates']));
            // You can store coordinates in a separate table or as JSON in the feedback table
            // For now, let's update the location with coordinates info
            $coordsInfo = "Lat: " . $input['coordinates']['latitude'] . ", Lng: " . $input['coordinates']['longitude'];
            if (empty($input['location'])) {
                $updateStmt = $pdo->prepare("UPDATE feedback SET location = ? WHERE id = ?");
                $updateStmt->execute([$coordsInfo, $feedbackId]);
                error_log("Updated location with coordinates: " . $coordsInfo);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        error_log("Transaction committed successfully");
        
        // Return success response
        $response = [
            'submitted' => true,
            'id' => $feedbackId,
            'message' => 'Feedback submitted successfully'
        ];
        
        error_log("Sending success response: " . json_encode($response));
        sendResponse($response);
        
    } catch (Exception $e) {
        $pdo->rollback();
        error_log("Transaction rolled back due to error: " . $e->getMessage());
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("ERROR in feedback submission: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    handleError('Failed to submit feedback: ' . $e->getMessage());
}

error_log("=== FEEDBACK SUBMIT REQUEST END ===");
?>
