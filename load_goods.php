<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = json_decode(file_get_contents('goods.json'), true);

foreach ($data['categories'] as $category) {
    $categoryId = mysqli_real_escape_string($conn, $category['id']);
    $categoryName = mysqli_real_escape_string($conn, $category['category_name']);
    $sql = "INSERT INTO categories (cat_id, cat_name) VALUES ('$categoryId', '$categoryName')";
    mysqli_query($conn, $sql);
}

foreach ($data['items'] as $item) {
    $itemName = mysqli_real_escape_string($conn, $item['name']);
    $categoryId = mysqli_real_escape_string($conn, $item['category']);
    $sql = "INSERT INTO goods (good_name, good_cat_id) VALUES ('$itemName', '$categoryId')";
    mysqli_query($conn, $sql);
}
$conn->close();
?>