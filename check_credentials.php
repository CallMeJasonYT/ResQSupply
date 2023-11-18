<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$message = '';

$username = $_GET['username'];
$password = $_GET['password'];

$fetchCredentials = $conn->execute_query("SELECT username, password FROM users WHERE username=? AND password=?", [$username, $password]);
$credentialsExist = $fetchCredentials->fetch_assoc();

// Check if both username and password are present in the result
if (isset($credentialsExist["username"]) && isset($credentialsExist["password"])) {
    $message = "True";
} else {
    $message = "False";
}

header('Content-Type: application/json');
echo json_encode(['message' => $message]);
?>