<?php
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../models/Request.php';
require_once __DIR__ . '/../models/User.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // Correction ici

// Simuler l'utilisateur connecté (à remplacer par un vrai système d'auth plus tard)
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$user_role = isset($_GET['role']) ? $_GET['role'] : 'demandeur';

if ($method === 'POST' && preg_match('#/requests$#', $path)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['target_ip'], $input['website_name'], $input['description'], $input['justification'], $input['user_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Champs requis manquants']);
        exit;
    }
    $ok = RequestModel::create($pdo, $input);
    if ($ok) {
        http_response_code(201);
        echo json_encode(['message' => 'Demande créée avec succès']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la création de la demande']);
    }
    exit;
}

if ($method === 'GET' && preg_match('#/requests$#', $path)) {
    if ($user_role === 'admin') {
        $requests = RequestModel::findAll($pdo);
    } else {
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(['message' => 'Non authentifié']);
            exit;
        }
        $requests = RequestModel::findByUser($pdo, $user_id);
    }
    echo json_encode($requests);
    exit;
}

if ($method === 'GET' && preg_match('#/requests/(\d+)$#', $path, $matches)) {
    $request = RequestModel::findById($pdo, $matches[1]);
    if ($request) {
        echo json_encode($request);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Demande non trouvée']);
    }
    exit;
}

if ($method === 'PUT' && preg_match('#/requests/(\d+)$#', $path, $matches)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Champs requis manquants']);
        exit;
    }
    $ok = RequestModel::updateStatus($pdo, $matches[1], $input['status'], $input['admin_comment'] ?? null);
    if ($ok) {
        echo json_encode(['message' => 'Statut mis à jour']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la mise à jour']);
    }
    exit;
}

http_response_code(404);
echo json_encode(['message' => 'Not found']);
