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
$requestData = json_decode($data);
$response = [];
$taskId = $requestData->taskId;

$stmtUpdate = $conn->prepare("UPDATE tasks SET task_status = 'Pending', task_date_pickup = NULL, task_veh = NULL WHERE task_id = ?");
$stmtUpdate->bind_param("i", $taskId);
$stmtUpdate->execute();
$stmtUpdate->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>