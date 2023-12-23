<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT vehicles.veh_id AS vehicleID, loads.load_goodn, loads.load_goodv, COUNT(CASE WHEN tasks.task_status = 'Executing' THEN 1 END) AS taskCount
        FROM vehicles
        INNER JOIN loads ON vehicles.veh_id = loads.load_veh
        LEFT JOIN tasks ON vehicles.veh_id = tasks.task_veh
        GROUP BY vehicles.veh_id, loads.load_goodn, loads.load_goodv";

$result = $conn->query($sql);

if ($result) {
    $truckDetails = array();
    while ($row = $result->fetch_assoc()) {
        $truckDetails[$row['vehicleID']][] = array(
            'load_goodn' => $row['load_goodn'],
            'load_goodv' => $row['load_goodv'],
            'taskCount' => $row['taskCount']
        );
    }
    $result->free();
}
$conn->close();

header('Content-Type: application/json');
echo json_encode($truckDetails);
?>