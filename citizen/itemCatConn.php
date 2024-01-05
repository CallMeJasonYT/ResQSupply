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

$categories = [];

$stmtSelect = $conn->prepare(
    "SELECT str_goodn, cat_name FROM storage 
    INNER JOIN goods ON str_goodn = good_name 
    INNER JOIN categories ON good_cat_id = cat_id");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $goodName = $row['str_goodn'];
        $catName = $row['cat_name'];
        if (!isset($categories[$catName])) {
            $categories[$catName] = ['items' => []];
        }
        $categories[$catName]['items'][] = $goodName;
    }
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode(['categories' => $categories]);
$conn->close();
?>