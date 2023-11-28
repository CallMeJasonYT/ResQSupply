<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = '';

$data = file_get_contents("php://input");

$loginData = json_decode($data);

$username = $loginData->username;
$password = $loginData->password;

$fetchCredentials = $conn->execute_query("SELECT username, password, category, user_id FROM users WHERE username=? AND password=?", [$username, $password]);
$credentialsExist = $fetchCredentials->fetch_assoc();

// Check if both username and password are present in the result
if (isset($credentialsExist["username"]) && isset($credentialsExist["password"])) {
    $response = $credentialsExist["category"];
    $_SESSION["username"] = $username;
    $_SESSION["id"] = $credentialsExist["user_id"];
} else {
    $response = "False";
    session_destroy();
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>