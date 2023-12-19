<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

$data = file_get_contents("php://input");

$RegData = json_decode($data);

$username = $RegData->username;
$fullname = $RegData->fullname;
$phone = $RegData->phone;
$address = $RegData->address;
$pass = $RegData->password;
$latitude = $RegData->latitude;
$longitude = $RegData->longitude;

if (isset($RegData->email)) {
    $email = $RegData->email;
} else {
    $email = null;
}

$_SESSION["username"] = $username;

$check_result = true;
while ($check_result) {
    $id = mt_rand(100000000, 999999999);
    $stmtSelect = $conn->prepare("SELECT user_id FROM users WHERE user_id=?");
    $stmtSelect->bind_param("i", $id);
    $stmtSelect->execute();
    $result = $stmtSelect->get_result();
    $check_result = mysqli_num_rows($result);
    $stmtSelect->close();
}

$_SESSION["id"] = $id;
$stmtInsert = $conn->prepare("INSERT INTO users (user_id, username, password) VALUES(?, ?, ?)");
$stmtInsert->bind_param("iss", $id, $username, $pass);
$stmtInsert->execute();
$stmtInsert->close();

$stmtInsert = $conn->prepare("INSERT INTO citizen (cit_id, cit_fullname, cit_tel, cit_email, cit_addr, cit_cords) VALUES (?, ?, ?, ?, ?, POINT(?,?))");
$stmtInsert->bind_param("issssdd", $id, $fullname, $phone, $email, $address, $latitude, $longitude);
$stmtInsert->execute();
$stmtInsert->close();
$conn->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
?>