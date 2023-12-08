<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if(!$conn) {
    die("Connection failed: ".mysqli_connect_error());
}

$query = "SELECT str_goodn, str_goodv FROM storage";

$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

while($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'strGoodN' => $row['str_goodn'],
        'strGoodV' => $row['str_goodv']
    ];
}

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>