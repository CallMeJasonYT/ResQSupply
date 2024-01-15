<?php
session_start();

if(!isset($_SESSION["category"]) || $_SESSION["category"] != 'rescuer'){
    session_destroy();
    header('Content-Type: application/json');
    echo json_encode("False");
    exit;
}

$sname = "localhost";
$uname = "root";
$password = "";
$db_name = "resqsupply";
$conn = new mysqli($sname, $uname, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

$username = $_SESSION["username"];
$response = [];

$stmtSelect = $conn->prepare(
    "SELECT res_veh FROM rescuer 
    INNER JOIN users ON user_id = res_id 
    WHERE username = ?"
);
$stmtSelect->bind_param('s', $username);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'username' => $username,
        'vehicle' => $row['res_veh']
    ];
    $_SESSION['veh_id'] = $row['res_veh'];
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>