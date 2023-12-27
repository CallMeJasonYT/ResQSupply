<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = file_get_contents("php://input");
$dataObject = json_decode($data);
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

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>