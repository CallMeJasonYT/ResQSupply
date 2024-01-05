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

$response = [];

$stmtSelectVehicles = $conn->prepare("SELECT veh_id, veh_loc, X(veh_cords) AS lat, Y(veh_cords) AS lon FROM vehicles");
$stmtSelectVehicles->execute();
$resultVehicles = $stmtSelectVehicles->get_result();

if (mysqli_num_rows($resultVehicles) > 0) {
    while ($rowVehicle = mysqli_fetch_assoc($resultVehicles)) {
        $veh_id = $rowVehicle['veh_id'];
        $status = 'Executing';
        $stmtSelectTasks = $conn->prepare("SELECT COUNT(*) as count FROM tasks WHERE task_veh = ? && task_status = ?");
        $stmtSelectTasks->bind_param("ss", $veh_id, $status);
        $stmtSelectTasks->execute();

        $resultTasks = $stmtSelectTasks->get_result();
        $rowTasks = mysqli_fetch_assoc($resultTasks);
        $category = ($rowTasks['count'] > 0) ? 'YesTruck' : 'NoTruck';
        $response[] = [
            'veh_id' => $veh_id,
            'lat' => $rowVehicle['lat'],
            'lon' => $rowVehicle['lon'],
            'category' => $category
        ];
        $stmtSelectTasks->close();
    }
}
$stmtSelectVehicles->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>