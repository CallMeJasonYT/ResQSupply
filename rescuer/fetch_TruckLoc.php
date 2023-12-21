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

$stmtSelect = $conn->prepare(
    "SELECT veh_loc, X(veh_cords) AS lat, Y(veh_cords) AS lon 
    FROM vehicles 
    WHERE veh_id = ?");

$stmtSelect->bind_param('s', $veh);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'lat' => $row['lat'],
            'lon' => $row['lon'],
            'category' => 'Truck'
        ];
    }
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>