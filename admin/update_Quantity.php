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

$input_data = file_get_contents("php://input");
$data = json_decode($input_data);

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