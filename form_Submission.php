<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = file_get_contents("php://input");

$offReqFormData = json_decode($data);
$id = $offReqFormData->id;
$goodn = $offReqFormData->goodn;
$goodv = $offReqFormData->goodv;
$type = $offReqFormData->type;

$registration_user = $conn->execute_query("INSERT INTO tasks (task_cit_id, task_goodn, task_goodv, task_cat, task_date_create) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)", [$id, $goodn, $goodv, $type]);

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>