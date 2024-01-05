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

$input_data = file_get_contents("php://input");
$data = json_decode($input_data);
$response = [];

foreach ($data as $goodName => $quantity) {
    $GoodName = $goodName;
    $Quantity = $quantity;
    $stmtUpdate = $conn->prepare("UPDATE storage SET str_goodv = ? WHERE str_goodn= ?");
    $stmtUpdate->bind_param("is", $Quantity, $GoodName);
    $stmtUpdate->execute();
    $stmtUpdate->close();
}

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>