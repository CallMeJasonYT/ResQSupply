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

$queryItems = "SELECT good_name FROM goods";
$stmtItems = mysqli_prepare($conn, $queryItems);
mysqli_stmt_execute($stmtItems);
$resultItems = mysqli_stmt_get_result($stmtItems);

$items = [];

while ($row = mysqli_fetch_assoc($resultItems)) {
    $items[] = $row['good_name'];
}

$queryCat = "SELECT cat_name FROM categories";
$stmtCat = mysqli_prepare($conn, $queryCat);
mysqli_stmt_execute($stmtCat);
$resultCat = mysqli_stmt_get_result($stmtCat);

$categories = [];

while ($row = mysqli_fetch_assoc($resultCat)) {
    $categories[] = $row['cat_name'];
}

$response['items'] = $items;
$response['categories'] = $categories;

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>