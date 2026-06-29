<?php
require_once __DIR__ . '/../../config.php';

$current = require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_response(405, ['error' => 'Method not allowed']);
}

$id = (int) ($_GET['id'] ?? 0);

if (!$id) {
    json_response(400, ['error' => 'Missing id']);
}

$stmt = db()->prepare('SELECT * FROM bookings WHERE id = ?');
$stmt->execute([$id]);
$booking = $stmt->fetch();

if (!$booking) {
    json_response(404, ['error' => 'Booking not found']);
}

if ($current['role'] !== 'admin' && $current['user_id'] !== (int) $booking['user_id']) {
    json_response(403, ['error' => 'Forbidden']);
}

$stmt = db()->prepare('DELETE FROM bookings WHERE id = ?');
$stmt->execute([$id]);

json_response(200, ['message' => 'Booking deleted']);
