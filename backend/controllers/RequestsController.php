<?php
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../models/Request.php';
require_once __DIR__ . '/../models/User.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Authentification par token sécurisé (stocké en base)
function getUserFromToken($pdo)
{
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) return null;
    $auth = $headers['Authorization'];
    if (strpos($auth, 'Bearer ') !== 0) return null;
    $token = substr($auth, 7);
    // Recherche de l'utilisateur par token
    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE api_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
}

$user = getUserFromToken($pdo);
$user_id = $user['id'] ?? null;
$user_role = $user['role'] ?? null;

if ($method === 'POST' && preg_match('#/requests$#', $path)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (
        !$input ||
        !isset($input['target_ip'], $input['website_name'], $input['description'], $input['justification'])
    ) {
        http_response_code(400);
        echo json_encode(['message' => 'Champs requis manquants']);
        exit;
    }
    if (!$user_id) {
        http_response_code(401);
        echo json_encode(['message' => 'Non authentifié']);
        exit;
    }
    // Ajoute l'user_id du token à la demande
    $input['user_id'] = $user_id;
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
    if (!$user_role) {
        http_response_code(401);
        echo json_encode(['message' => 'Non authentifié']);
        exit;
    }
    if ($user_role === 'admin') {
        $requests = RequestModel::findAll($pdo);
    } else {
        $requests = RequestModel::findByUser($pdo, $user_id);
    }
    echo json_encode($requests);
    exit;
}

if ($method === 'GET' && preg_match('#/requests/(\d+)$#', $path, $matches)) {
    if (!$user_role) {
        http_response_code(401);
        echo json_encode(['message' => 'Non authentifié']);
        exit;
    }
    $request = RequestModel::findById($pdo, $matches[1]);
    if ($request) {
        // Si non admin, vérifier que la demande appartient à l'utilisateur
        if ($user_role !== 'admin' && $request['user_id'] != $user_id) {
            http_response_code(403);
            echo json_encode(['message' => 'Accès interdit']);
            exit;
        }
        echo json_encode($request);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Demande non trouvée']);
    }
    exit;
}

if ($method === 'PUT' && preg_match('#/requests/(\d+)$#', $path, $matches)) {
    if ($user_role !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Action réservée à l\'admin']);
        exit;
    }
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
