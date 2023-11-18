<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$username = $_GET['username'];

$fetchUsername = $conn->execute_query("SELECT username FROM users WHERE username=?", [$username]);
$usernameExists = $fetchUsername->fetch_assoc();

header('Content-Type: application/json');
echo json_encode(['message' => $usernameExists ? 'True' : 'False']);
?>