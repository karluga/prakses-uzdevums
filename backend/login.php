<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// preflight request
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

// Use the decoded JSON data to check the user
echo json_encode($user->check_user($jsonData['username'], $jsonData['password']));
?>