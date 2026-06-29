<?php
require_once __DIR__ . '/../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $destination_id = $_GET['destination_id'] ?? null;
    $business_id = $_GET['business_id'] ?? null;

    $sql = 'SELECT r.*, u.name AS user_name, u.avatar AS user_avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE 1=1';
    $params = [];

    if ($destination_id) {
        $sql .= ' AND r.destination_id = ?';
        $params[] = $destination_id;
    }
    if ($business_id) {
        $sql .= ' AND r.business_id = ?';
        $params[] = $business_id;
    }
    $sql .= ' ORDER BY r.created_at DESC';

    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    json_response(200, ['reviews' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $user = require_auth();
    $body = get_json_body();

    $rating = (int) ($body['rating'] ?? 0);
    if ($rating < 1 || $rating > 5) {
        json_response(400, ['error' => 'Rating must be 1-5']);
    }

    $stmt = db()->prepare('INSERT INTO reviews (user_id, destination_id, business_id, rating, comment) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $user['user_id'],
        $body['destination_id'] ?? null,
        $body['business_id'] ?? null,
        $rating,
        $body['comment'] ?? null,
    ]);
    $id = (int) db()->lastInsertId();

    $stmt = db()->prepare('SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?');
    $stmt->execute([$id]);
    json_response(201, ['review' => $stmt->fetch()]);
}

json_response(405, ['error' => 'Method not allowed']);
