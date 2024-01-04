<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "SELECT ann_id, ann_title, ann_text, ann_date, needs_goodn FROM announcements INNER JOIN needs WHERE ann_id=needs_ann_id";
$result = mysqli_query($conn, $query);

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

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>