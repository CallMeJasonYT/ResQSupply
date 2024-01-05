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

$veh = $_SESSION['veh_id'];
$response = [];

$stmtSelect = $conn->prepare(
    "SELECT load_goodn, SUM(load_goodv) as total_load_goodv FROM loads
    WHERE load_veh = ? 
    GROUP BY load_goodn;"
);
$stmtSelect->bind_param('s', $veh);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'loadGoodN' => $row['load_goodn'],
        'loadGoodV' => $row['total_load_goodv']
    ];
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>