<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Replace * with the specific origin you want to allow, or use multiple headers for multiple origins
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// Handle OPTIONS method (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['message' => 'Only the POST method is supported in this route']);
    exit();
}

require_once('Database.php');
require_once('User.php');

$db = new Database();
$user = new User($db);

// Retrieve JSON data from the request body
$jsonData = json_decode(file_get_contents('php://input'), true);

echo json_encode($user->register_user($jsonData['username'], $jsonData['email'], $jsonData['password']));
?>
