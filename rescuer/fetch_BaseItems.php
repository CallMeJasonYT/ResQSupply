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

$stmtSelect = $conn->prepare("SELECT str_goodn, str_goodv FROM storage");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
        'strGoodN' => $row['str_goodn'],
        'strGoodV' => $row['str_goodv']
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>