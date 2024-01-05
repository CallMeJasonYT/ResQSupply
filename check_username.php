<?php

$sname = "localhost";
$uname = "root";
$password = "";
$db_name = "resqsupply";
$conn = new mysqli($sname, $uname, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

$data = file_get_contents("php://input");
$regData = json_decode($data);
$response = [];
$username = $regData->username;

$stmtSelect = $conn->prepare("SELECT username FROM users WHERE username=?");
$stmtSelect->bind_param("s", $username);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    $response = "True";
} else {
    $response = "False";
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode([$response]);
$conn->close();
?>