<?php
require_once __DIR__ . '/../config.php';

$businesses = (int) db()->query("SELECT COUNT(*) FROM businesses WHERE status='approved'")->fetchColumn();
$tourists   = (int) db()->query("SELECT COUNT(*) FROM users WHERE role='tourist'")->fetchColumn();
$bookings   = (int) db()->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
$revenue    = (float) db()->query("SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status IN ('confirmed','completed')")->fetchColumn();
$dests      = (int) db()->query("SELECT COUNT(*) FROM destinations")->fetchColumn();

json_response(200, [
    'local_businesses'  => $businesses,
    'tourists_connected' => $tourists,
    'bookings_completed' => $bookings,
    'revenue_generated'  => $revenue,
    'destinations'       => $dests,
]);
