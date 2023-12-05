<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$veh_id = "HEY1234";

$stmt = $conn->prepare("SELECT load_goodn, SUM(load_goodv) as total_load_goodv FROM loads
                        WHERE load_veh = ? GROUP BY load_goodn;");
$stmt->bind_param('i', $veh_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'loadGoodN' => $row['load_goodn'],
        'loadGoodV' => $row['total_load_goodv']
    ];
}

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>