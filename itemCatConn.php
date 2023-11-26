<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "SELECT good_name, cat_name FROM goods INNER JOIN categories ON good_cat_id = cat_id";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$categories = [];

while ($row = mysqli_fetch_assoc($result)) {
    $goodName = $row['good_name'];
    $catName = $row['cat_name'];

    if (!isset($categories[$catName])) {
        $categories[$catName] = ['items' => []];
    }
    $categories[$catName]['items'][] = $goodName;
}

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode(['categories' => $categories]);
?>