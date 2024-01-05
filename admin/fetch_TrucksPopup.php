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
$veh_id = $dataObject->vehicleID;

$stmtSelect = $conn->prepare("SELECT load_goodn, load_goodv
        FROM vehicles
        INNER JOIN loads ON veh_id = load_veh
        WHERE veh_id = ?
        GROUP BY veh_id, load_goodn, load_goodv");

$stmtSelect->bind_param("s", $veh_id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = $result->fetch_assoc()) {
        $response[] = [
            'load_goodn' => $row['load_goodn'],
            'load_goodv' => $row['load_goodv']
        ];
    }
    $stmtSelect->close();
}

$stmtSelect = $conn->prepare("SELECT COUNT(*) AS taskCount
        FROM tasks
        INNER JOIN vehicles ON task_veh = veh_id
        WHERE veh_id = ? && task_status = 'Executing'");

$stmtSelect->bind_param("s", $veh_id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = $result->fetch_assoc()) {
        $response['taskCount'] = $row['taskCount'];
    }
    $stmtSelect->close();
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>