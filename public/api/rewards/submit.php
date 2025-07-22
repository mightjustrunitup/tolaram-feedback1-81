<?php
require_once '../config.php';

try {
    $pdo = getDbConnection();
    
    // Get input data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate required field
    if (!isset($data['phone']) || empty(trim($data['phone']))) {
        handleError('Phone number is required', 400);
        return;
    }
    
    // Begin transaction
    $pdo->beginTransaction();
    
    try {
        // Insert customer rewards data
        $stmt = $pdo->prepare("
            INSERT INTO customer_rewards (customer_name, phone, feedback_id, location, coordinates, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $coordinatesJson = null;
        if (isset($data['coordinates']) && is_array($data['coordinates'])) {
            $coordinatesJson = json_encode($data['coordinates']);
        }
        
        $stmt->execute([
            $data['customerName'] ?? null,
            trim($data['phone']),
            $data['feedbackId'] ?? null,
            $data['location'] ?? null,
            $coordinatesJson
        ]);
        
        $rewardId = $pdo->lastInsertId();
        
        // Commit transaction
        $pdo->commit();
        
        sendResponse([
            'success' => true,
            'id' => $rewardId,
            'message' => 'Successfully joined rewards program'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Error submitting customer rewards: " . $e->getMessage());
    handleError('Failed to join rewards program');
}
?>