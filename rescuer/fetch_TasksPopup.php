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
    "SELECT cit_fullname, cit_tel, cit_addr, task_date_create, task_goodn, task_goodv, task_date_pickup, task_veh FROM citizen 
    INNER JOIN tasks ON cit_id = task_cit_id
    WHERE task_id = ?"
);
$stmtSelect->bind_param("i", $task_id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'fullname' => $row['cit_fullname'],
            'telephone' => $row['cit_tel'],
            'address' => $row['cit_addr'],
            'creationDate' => $row['task_date_create'],
            'goodName' => $row['task_goodn'],
            'goodValue' => $row['task_goodv'],
            'pickupDate' => $row['task_date_pickup'],
            'vehicle' => $row['task_veh']
        ];
    }
} else {
    $response[] = $stmtSelect;
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>