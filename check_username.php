<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = '';

$data = file_get_contents("php://input");

$regData = json_decode($data);

$username = $regData->username;

$fetchUsername = $conn->execute_query("SELECT username FROM users WHERE username=?", [$username]);
$usernameExists = $fetchUsername->fetch_assoc();

if ($usernameExists) {
    $response = "True";
} else {
    $response = "False";
}

header('Content-Type: application/json');
echo json_encode([$response]);

$conn->close();
?>