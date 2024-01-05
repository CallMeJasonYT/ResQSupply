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
$dataObject = json_decode($data);
$veh = $_SESSION['veh_id'];
$response = [];
$taskId = $dataObject->taskId;
$currentDateTime = date('Y-m-d H:i:s');

$stmtUpdate = $conn->prepare("UPDATE tasks SET task_status = 'executing', task_date_pickup = ?, task_veh = ? WHERE task_id = ?");
$stmtUpdate->bind_param('ssi', $currentDateTime, $veh, $taskId);
$stmtUpdate->execute();
$stmtUpdate->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>