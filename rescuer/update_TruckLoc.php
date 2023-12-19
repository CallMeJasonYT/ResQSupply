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

$veh = $_SESSION['veh_id'];

$data = file_get_contents("php://input");
$dataObject = json_decode($data);
$newAddress = $dataObject->address;

$update_trloc = $conn->execute_query("UPDATE vehicles SET veh_loc = ? WHERE veh_id = ?", [$newAddress, $veh]);

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>