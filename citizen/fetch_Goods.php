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
$items = [];

$stmtSelectItems = $conn->prepare("SELECT str_goodn FROM storage");
$stmtSelectItems->execute();
$resultItems = $stmtSelectItems->get_result();

while ($row = mysqli_fetch_assoc($resultItems)) {
    $items[] = $row['str_goodn'];
}
$stmtSelectItems->close();

$stmtSelectCat = $conn->prepare("SELECT cat_name FROM categories INNER JOIN goods ON good_cat_id = cat_id INNER JOIN storage ON str_goodn = good_name");
$stmtSelectCat->execute();
$resultCat = $stmtSelectCat->get_result();

$categories = [];
if (mysqli_num_rows($resultCat) > 0) {
    while ($row = mysqli_fetch_assoc($resultCat)) {
        $categories[] = $row['cat_name'];
    }
}
$stmtSelectCat->close();

$response['items'] = $items;
$response['categories'] = $categories;

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>