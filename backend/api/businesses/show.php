<?php
require_once __DIR__ . '/../../config.php';

$user = require_auth();
$id = (int) ($_GET['id'] ?? 0);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare('
        SELECT b.*, u.name AS owner_name, u.email AS owner_email
        FROM businesses b JOIN users u ON b.user_id = u.id
        WHERE b.id = ?
    ');
    $stmt->execute([$id]);
    $biz = $stmt->fetch();
    if (!$biz) json_response(404, ['error' => 'Business not found']);
    json_response(200, ['business' => $biz]);
}

if ($method === 'PUT') {
    $body = get_json_body();

    // Status-only update (approve/reject from admin panel)
    if (array_key_exists('status', $body) && count($body) === 1) {
        $validStatus = in_array($body['status'], ['pending', 'approved', 'rejected']) ? $body['status'] : 'pending';
        $stmt = db()->prepare('UPDATE businesses SET status = ? WHERE id = ?');
        $stmt->execute([$validStatus, $id]);
    }
    // Full business update (from edit form)
    elseif (array_key_exists('business_name', $body)) {
        if ($user['role'] === 'admin') {
            $stmt = db()->prepare('UPDATE businesses SET business_name=?, business_type=?, city=?, phone=?, description=?, price=?, nib=?, status=? WHERE id = ?');
            $stmt->execute([
                trim($body['business_name'] ?? ''),
                trim($body['business_type'] ?? ''),
                trim($body['city'] ?? ''),
                trim($body['phone'] ?? ''),
                $body['description'] ?? null,
                (float)($body['price'] ?? 0),
                $body['nib'] ?? null,
                $body['status'] ?? 'pending',
                $id,
            ]);
        } else {
            $stmt = db()->prepare('UPDATE businesses SET business_name=?, business_type=?, city=?, phone=?, description=?, price=?, nib=? WHERE id=? AND user_id=?');
            $stmt->execute([
                trim($body['business_name'] ?? ''),
                trim($body['business_type'] ?? ''),
                trim($body['city'] ?? ''),
                trim($body['phone'] ?? ''),
                $body['description'] ?? null,
                (float)($body['price'] ?? 0),
                $body['nib'] ?? null,
                $id,
                $user['user_id'],
            ]);
        }
    }
    // Status update with other fields
    elseif (array_key_exists('status', $body)) {
        $validStatus = in_array($body['status'], ['pending', 'approved', 'rejected']) ? $body['status'] : 'pending';
        $stmt = db()->prepare('UPDATE businesses SET status = ? WHERE id = ?');
        $stmt->execute([$validStatus, $id]);
    }
    $stmt = db()->prepare('SELECT * FROM businesses WHERE id = ?');
    $stmt->execute([$id]);
    json_response(200, ['business' => $stmt->fetch()]);
}

if ($method === 'DELETE') {
    if ($user['role'] === 'admin') {
        $stmt = db()->prepare('DELETE FROM businesses WHERE id = ?');
        $stmt->execute([$id]);
    } else {
        $stmt = db()->prepare('DELETE FROM businesses WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $user['user_id']]);
    }
    json_response(200, ['message' => 'Deleted']);
}

json_response(405, ['error' => 'Method not allowed']);
