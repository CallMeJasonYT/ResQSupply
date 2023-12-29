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
$truckid = $RegData->truckid;
$latitude = $RegData->latitude;
$longitude = $RegData->longitude;

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

$stmtInsert = $conn->prepare("INSERT INTO vehicles (veh_id, veh_loc, veh_cords) VALUES (?, ?, POINT(?,?))");
$stmtInsert->bind_param("ssdd", $truckid, $address, $latitude, $longitude);
$stmtInsert->execute();
$stmtInsert->close();

$stmtInsert = $conn->prepare("INSERT INTO users (user_id, username, password, category) VALUES(?, ?, ?, 'rescuer')");
$stmtInsert->bind_param("iss", $id, $username, $pass);
$stmtInsert->execute();
$stmtInsert->close();

$stmtInsert = $conn->prepare("INSERT INTO rescuer (res_id, res_veh, res_fullname, res_tel) VALUES (?, ?, ?, ?)");
$stmtInsert->bind_param("isss", $id, $truckid, $fullname, $phone);
$stmtInsert->execute();
$stmtInsert->close();
$conn->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
?>