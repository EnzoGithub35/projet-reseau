<?php
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../models/User.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

if ($method === 'POST' && preg_match('#/auth/register$#', $path)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['message' => 'Requête JSON invalide']);
        exit;
    }
    if (!isset($input['username'], $input['password'], $input['fullname'], $input['email'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Champs requis manquants']);
        exit;
    }
    if (User::findByUsername($pdo, $input['username'])) {
        http_response_code(409);
        echo json_encode(['message' => 'Nom d\'utilisateur déjà utilisé']);
        exit;
    }
    if (User::findByEmail($pdo, $input['email'])) {
        http_response_code(409);
        echo json_encode(['message' => 'Email déjà utilisé']);
        exit;
    }
    $hash = password_hash($input['password'], PASSWORD_BCRYPT);
    $ok = User::create($pdo, [
        'username' => $input['username'],
        'password' => $hash,
        'fullname' => $input['fullname'],
        'email' => $input['email'],
        'role' => 'demandeur'
    ]);
    if ($ok) {
        http_response_code(201);
        echo json_encode(['message' => 'Compte créé avec succès']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la création du compte']);
    }
    exit;
}

if ($method === 'POST' && preg_match('#/auth/login$#', $path)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['message' => 'Requête JSON invalide']);
        exit;
    }
    if (!isset($input['username'], $input['password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Champs requis manquants']);
        exit;
    }
    $user = User::findByUsername($pdo, $input['username']);
    if (!$user || !password_verify($input['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Identifiants invalides']);
        exit;
    }
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET api_token = ? WHERE id = ?");
    $stmt->execute([$token, $user['id']]);
    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'fullname' => $user['fullname'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['message' => 'Not found']);
