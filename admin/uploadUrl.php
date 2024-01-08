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

$cat_id = array();
$good_name = array();
$response = [];

$stmtSelect = $conn->prepare("SELECT cat_id FROM categories");
$stmtSelect->execute();
$stmtSelect->bind_result($existingCatId);

while ($stmtSelect->fetch()) {
    $cat_id[] = $existingCatId;
}
$stmtSelect->close();

$stmtSelect = $conn->prepare("SELECT good_name FROM goods");
$stmtSelect->execute();
$stmtSelect->bind_result($existingGoodName);

while ($stmtSelect->fetch()) {
    $good_name[] = strtolower(str_replace(' ', '', $existingGoodName));
}
$stmtSelect->close();

$data = file_get_contents("php://input");
$jsonData = json_decode($data);

foreach ($jsonData->categories as $category) {
    $id = $category->id;
    $name = rtrim($category->category_name);

    if (!in_array($id, $cat_id) && $name != "") {
        $stmtInsert = $conn->prepare("INSERT INTO categories (cat_id, cat_name) VALUES (?, ?)");
        $stmtInsert->bind_param("is", $id, $name);
        $stmtInsert->execute();
        $stmtInsert->close();
        $cat_id[] = $id;
    }
}

foreach ($jsonData->items as $item) {
     $name = rtrim($item->name);
    $category_id = $item->category;
    if (!empty($item->details)) {
        $detail_name = $item->details[0]->detail_name;
        $detail_value = $item->details[0]->detail_value;
    } else {
        $detail_name = null;
        $detail_value = null;
    }

    if (!in_array(strtolower(str_replace(' ', '', $name)), $good_name) && in_array($category_id, $cat_id) && $name != "") {
        $stmtInsert = $conn->prepare("INSERT INTO goods (good_name, good_detn, good_detv, good_cat_id) VALUES (?, ?, ?, ?)");
        $stmtInsert->bind_param("ssii", $name, $detail_name, $detail_value, $category_id);
        $stmtInsert->execute();
        $stmtInsert->close();
        $good_name[] = strtolower(str_replace(' ', '', $name));
    }
}

$response = "OK";
echo json_encode($response);
$conn->close();
?>