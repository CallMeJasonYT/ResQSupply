<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = '';

$data = file_get_contents("php://input");
$regData = json_decode($data);
$truckid = $regData->truckid;

$stmtSelect = $conn->prepare("SELECT * FROM vehicles WHERE veh_id = ?");
$stmtSelect->bind_param("s", $truckid);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    $response = "True";
} else {
    $response = "False";
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>