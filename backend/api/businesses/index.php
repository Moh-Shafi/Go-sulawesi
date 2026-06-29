<?php
require_once __DIR__ . '/../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = require_auth();

    if ($user['role'] === 'admin') {
        $stmt = db()->query('
            SELECT b.*, u.name AS owner_name, u.email AS owner_email
            FROM businesses b JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        ');
    } else {
        $stmt = db()->prepare('
            SELECT b.*, u.name AS owner_name, u.email AS owner_email
            FROM businesses b JOIN users u ON b.user_id = u.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        ');
        $stmt->execute([$user['user_id']]);
    }
    json_response(200, ['businesses' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $user = require_role('local');
    $body = get_json_body();

    $stmt = db()->prepare('INSERT INTO businesses (user_id, business_name, business_type, city, phone, description, nib) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $user['user_id'],
        trim($body['business_name'] ?? ''),
        trim($body['business_type'] ?? ''),
        trim($body['city'] ?? ''),
        trim($body['phone'] ?? ''),
        $body['description'] ?? null,
        $body['nib'] ?? null,
    ]);
    $id = (int) db()->lastInsertId();

    $stmt = db()->prepare('SELECT * FROM businesses WHERE id = ?');
    $stmt->execute([$id]);
    json_response(201, ['business' => $stmt->fetch()]);
}

json_response(405, ['error' => 'Method not allowed']);
