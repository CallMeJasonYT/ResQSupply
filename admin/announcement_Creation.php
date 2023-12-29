<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

$data = file_get_contents("php://input");

$RegData = json_decode($data);

$title = $RegData->title;
$details = $RegData->details;
$selectedItems = $RegData->selectedItems;

$currentDateTime = date('Y-m-d H:i:s');
$stmtInsert = $conn->prepare("INSERT INTO announcements (ann_title, ann_text, ann_date, ann_base_id) VALUES (?, ?, ?, '1')");
$stmtInsert->bind_param("sss", $title, $details, $currentDateTime);
$stmtInsert->execute();
$annId = $stmtInsert->insert_id;
$stmtInsert->close();

foreach ($selectedItems as $item) {
    $stmtInsert = $conn->prepare("INSERT INTO needs (needs_ann_id, needs_goodn) VALUES(?, ?)");
    $stmtInsert->bind_param("is", $annId, $item);
    $stmtInsert->execute();
    $stmtInsert->close();
}
$conn->close();
$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
?>