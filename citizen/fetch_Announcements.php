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

$response = [];

$stmtSelect = $conn->prepare("SELECT ann_id, ann_title, ann_text, ann_date, needs_goodn FROM announcements INNER JOIN needs WHERE ann_id=needs_ann_id ORDER BY ann_date DESC");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    $groupedData = array();
    while ($row = mysqli_fetch_assoc($result)) {

        $key = $row['ann_id'];

        if (!isset($groupedData[$key])) {
            $groupedData[$key] = $row;
            $groupedData[$key]['needs_goodn'] = array($row['needs_goodn']);
        } else {
            $groupedData[$key]['needs_goodn'][] = $row['needs_goodn'];
        }
    }
    $response = array_values($groupedData);
} else {
    $response = "False";
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>