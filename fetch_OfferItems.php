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

$data = file_get_contents("php://input");

$ann_id = json_decode($data)->id;
$query = "SELECT good_name, good_cat_id, cat_name FROM goods 
          INNER JOIN categories ON cat_id = good_cat_id
          INNER JOIN needs ON good_name = needs_goodn 
          INNER JOIN announcements ON needs_ann_id = ann_id 
          WHERE needs_ann_id = ?";

$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "i", $ann_id);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'goodName' => $row['good_name'],
        'goodCatId' => $row['good_cat_id'],
        'goodCatName' => $row['cat_name']
    ];
}

// Close the connection
mysqli_close($conn);

// Set the appropriate headers
header('Content-Type: application/json');

// Encode and echo the response
echo json_encode($response);
?>