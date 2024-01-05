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

$response = [];
$veh = $_SESSION['veh_id'];

$data = file_get_contents("php://input");
$dataObject = json_decode($data);
$newAddress = $dataObject->address;
$newAddresslat = $dataObject->latitude;
$newAddresslon = $dataObject->longitude;

$stmtUpdate = $conn->prepare("UPDATE vehicles SET veh_loc = ?, veh_cords = POINT(?,?) WHERE veh_id = ?");
$stmtUpdate->bind_param("sdds", $newAddress, $newAddresslat, $newAddresslon, $veh);
$stmtUpdate->execute();
$stmtUpdate->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>