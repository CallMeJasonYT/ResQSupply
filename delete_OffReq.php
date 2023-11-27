<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = file_get_contents("php://input");

$offReqData = json_decode($data);
$id = $offReqData->id;

$query = "DELETE FROM tasks WHERE task_id = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>