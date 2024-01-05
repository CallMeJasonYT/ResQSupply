<?php
session_start();

$sname = "localhost";
$uname = "root";
$password = "";
$db_name = "resqsupply";
$conn = new mysqli($sname, $uname, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

$data = file_get_contents("php://input");
$citAddress = json_decode($data);
$response = [];
$id = $_SESSION["id"];
$newAddress = $citAddress->address;
$newAddresslat = $citAddress->latitude;
$newAddresslon = $citAddress->longitude;

$stmtUpdate = $conn->prepare("UPDATE citizen SET cit_addr = ?, cit_cords = POINT(?, ?) WHERE cit_id = ?");
$stmtUpdate->bind_param("sddi", $newAddress, $newAddresslat, $newAddresslon, $id);
$stmtUpdate->execute();
$stmtUpdate->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>