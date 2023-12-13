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
$task_id = $dataObject->taskID;

if($task_id != 'Truck' && $task_id != null) {
    $stmtSelect = $conn->prepare(
    "SELECT task_cat, task_status, task_veh
    FROM citizen
    INNER JOIN tasks
    ON cit_id = task_cit_id
    WHERE task_id = ?");

    $stmtSelect->bind_param("i", $task_id);

    $stmtSelect->execute();
    $result = $stmtSelect->get_result();

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $response[] = [
                'category' => $row['task_cat'],
                'status' => $row['task_status'],
                'veh' => $row['task_veh']
            ];
        }
    }
    $stmtSelect->close();
}else if($task_id == 'Truck'){
    $response[] = ['category' => 'Truck'];
}else{$response[] = ['category' => 'Base'];}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>