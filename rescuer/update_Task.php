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
$taskId = $dataObject->taskId;

$currentDateTime = date('Y-m-d H:i:s');

$stmt = $conn->prepare("UPDATE tasks SET task_status = 'executing', task_date_pickup = ?, task_veh = ? WHERE task_id = ?");
$stmt->bind_param('ssi', $currentDateTime, $veh, $taskId);
$stmt->execute();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>