<?php

session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = file_get_contents("php://input");

$citAddress = json_decode($data);
$id = $_SESSION["id"];
$newAddress = $citAddress->newAddress;

$update_citizen = $conn->execute_query("UPDATE citizen SET cit_addr = ? WHERE cit_id = ?", [$newAddress, $id]);

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>