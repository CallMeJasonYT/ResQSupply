<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];
$itemsInStorage = [];
$itemsInGoods = [];

$input_data = file_get_contents("php://input");
$itemsInGoods = json_decode($input_data);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$stmtSelect = $conn->prepare("SELECT str_goodn FROM storage");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $itemsInStorage[] = $row["str_goodn"];
    }
}
$stmtSelect->close();

$stmtInsert = $conn->prepare("INSERT INTO storage (str_id, str_goodn, str_goodv, str_base) VALUES (null, ?, '0', '1')");
foreach ($itemsInGoods as $item) {
    if (!in_array($item, $itemsInStorage)) {
        $stmtInsert->bind_param("s", $item);
        $stmtInsert->execute();
    }
}
$stmtInsert->close();

$itemsInStorage = [];
$stmtSelect = $conn->prepare("SELECT str_goodn FROM storage");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $itemsInStorage[] = $row["str_goodn"];
    }
}
$stmtSelect->close();

$stmtDelete = $conn->prepare("DELETE FROM storage WHERE str_goodn = ?");
foreach ($itemsInStorage as $item){
    if(!in_array($item, $itemsInGoods)){
        $stmtDelete->bind_param("s", $item);
        $stmtDelete->execute();
    }
}
$stmtDelete->close();

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>