<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);


if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$data = file_get_contents("php://input");
$dataObj = json_decode($data);
$response = [];
$ann_id = $dataObj->id;

$stmtSelect = $conn->prepare("SELECT good_name, good_cat_id, cat_name FROM goods 
          INNER JOIN categories ON cat_id = good_cat_id
          INNER JOIN needs ON good_name = needs_goodn 
          INNER JOIN announcements ON needs_ann_id = ann_id 
          WHERE needs_ann_id = ?");
$stmtSelect->bind_param("i", $ann_id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'goodName' => $row['good_name'],
        'goodCatId' => $row['good_cat_id'],
        'goodCatName' => $row['cat_name']
    ];
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>