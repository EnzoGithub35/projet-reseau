<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Routeur principal
$uri = $_SERVER['REQUEST_URI'];

if (preg_match('#^/auth/#', $uri)) {
    require_once __DIR__ . '/../routes/auth.php';
    exit;
}
if (preg_match('#^/requests#', $uri)) {
    require_once __DIR__ . '/../routes/requests.php';
    exit;
}
// Ajouter d'autres routes ici (test_results, etc.)

http_response_code(404);
echo json_encode(['message' => 'Not found']);
