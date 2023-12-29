<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$data = file_get_contents("php://input");
$dataObject = json_decode($data);
$newAddress = $dataObject->address;
$newAddresslat = $dataObject->latitude;
$newAddresslon = $dataObject->longitude;


$stmtUpdate = $conn->prepare("UPDATE base SET base_loc = ?, base_cords = POINT(?,?) WHERE base_id= '1'");
$stmtUpdate->bind_param("sdd", $newAddress, $newAddresslat, $newAddresslon);
$stmtUpdate->execute();
$stmtUpdate->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>