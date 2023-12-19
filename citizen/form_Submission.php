<?php

session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = file_get_contents("php://input");

$offReqFormData = json_decode($data);
$id = $_SESSION["id"];
$goodn = $offReqFormData->goodn;
$goodv = $offReqFormData->goodv;
$type = $offReqFormData->type;

$stmtSelect = $conn->prepare("SELECT X(cit_cords) AS lat, Y(cit_cords) AS lon FROM citizen WHERE cit_id = ?");
$stmtSelect->bind_param("i", $id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $lat = $row["lat"];
        $lon = $row["lon"];
    }
}
$stmtSelect->close();

$stmtInsert = $conn->prepare("INSERT INTO tasks (task_cit_id, task_goodn, task_goodv, task_cat, task_date_create, task_loc) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP, POINT(?,?))");
$stmtInsert->bind_param("isssdd", $id, $goodn, $goodv, $type, $lat, $lon);
$stmtInsert->execute();
$stmtInsert->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>