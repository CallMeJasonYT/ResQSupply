<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$data = file_get_contents("php://input");
$requestData = json_decode($data);

$taskId = $requestData->taskId;

$stmtUpdate = $conn->prepare("UPDATE tasks SET task_status = 'Pending', task_date_pickup = NULL, task_veh = NULL WHERE task_id = ?");
$stmtUpdate->bind_param("i", $taskId);

if ($stmtUpdate->execute()) {
    $response = ["success" => true];
} else {
    $response = ["success" => false, "error" => mysqli_error($conn)];
}

$stmtUpdate->close();

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>