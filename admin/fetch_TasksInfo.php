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
$response = [];
$task_id = $dataObject->taskID;

$stmtSelect = $conn->prepare(
    "SELECT task_cat, task_status, task_veh
    FROM citizen
    INNER JOIN tasks
    ON cit_id = task_cit_id
    WHERE task_id = ?"
);

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

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>