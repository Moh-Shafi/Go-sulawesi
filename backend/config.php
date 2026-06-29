<?php
// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_NAME', getenv('DB_NAME') ?: 'gosulawesi');
define('DB_USER', getenv('DB_USER') ?: 'gosulawesi_user');
define('DB_PASS', getenv('DB_PASS') ?: 'gosulawesi_pass');

// JWT-like simple token secret
define('TOKEN_SECRET', 'gosulawesi_secret_key_2024');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
function db() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            json_response(500, ['error' => 'Database connection failed', 'detail' => $e->getMessage()]);
        }
    }
    return $pdo;
}

// JSON response helper
function json_response($code, $data) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Get JSON body
function get_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return $data ?: [];
}

// Simple token generate
function generate_token($user_id, $role) {
    $payload = base64_encode(json_encode([
        'user_id' => $user_id,
        'role' => $role,
        'exp' => time() + (60 * 60 * 24 * 7), // 7 days
    ]));
    $signature = hash_hmac('sha256', $payload, TOKEN_SECRET);
    return $payload . '.' . $signature;
}

// Verify token
function verify_token() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$auth || !str_starts_with($auth, 'Bearer ')) {
        return null;
    }
    $token = substr($auth, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 2) return null;
    [$payload, $signature] = $parts;
    $expected = hash_hmac('sha256', $payload, TOKEN_SECRET);
    if (!hash_equals($expected, $signature)) return null;
    $data = json_decode(base64_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    return $data;
}

// Require auth
function require_auth() {
    $user = verify_token();
    if (!$user) {
        json_response(401, ['error' => 'Unauthorized']);
    }
    return $user;
}

// Require specific role
function require_role($role) {
    $user = require_auth();
    if ($user['role'] !== $role && $user['role'] !== 'admin') {
        json_response(403, ['error' => 'Forbidden']);
    }
    return $user;
}
