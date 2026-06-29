<?php
require_once __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['error' => 'Method not allowed']);
}

$body = get_json_body();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) {
    json_response(400, ['error' => 'Email and password required']);
}

$stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    json_response(401, ['error' => 'Invalid email or password']);
}

$token = generate_token($user['id'], $user['role']);

json_response(200, [
    'message' => 'Login successful',
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'avatar' => $user['avatar'],
    ],
]);
