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

$queryItems = "SELECT str_goodn FROM storage";
$stmtItems = mysqli_prepare($conn, $queryItems);
mysqli_stmt_execute($stmtItems);
$resultItems = mysqli_stmt_get_result($stmtItems);

$items = [];

while ($row = mysqli_fetch_assoc($resultItems)) {
    $items[] = $row['str_goodn'];
}

$stmtSelect = $conn->prepare("SELECT cat_name FROM categories INNER JOIN goods ON good_cat_id = cat_id INNER JOIN storage ON str_goodn = good_name");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

$categories = [];
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $categories[] = $row['cat_name'];
    }
}
$stmtSelect->close();

$response['items'] = $items;
$response['categories'] = $categories;

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>