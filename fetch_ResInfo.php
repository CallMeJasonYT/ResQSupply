<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if(!$conn) {
    die("Connection failed: ".mysqli_connect_error());
}

$username = $_SESSION["username"];

$stmtSelect = $conn->prepare("SELECT res_veh FROM rescuer INNER JOIN users ON user_id = res_id WHERE username = ?");
if(!$stmtSelect) {
    die("Prepare failed: ".$conn->error);
}

$stmtSelect->bind_param('s', $username);
$stmtSelect->execute();

$stmtSelect->bind_result($veh_id);

$response = [];

while($stmtSelect->fetch()) {
    $response[] = [
        'username' => $username,
        'vehicle' => $veh_id
    ];
    $_SESSION['veh_id'] = $veh_id;
}

$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode(['data' => $response]);

$conn->close();
?>