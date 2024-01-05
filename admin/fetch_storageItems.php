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

$stmtSelect = $conn->prepare(
    "SELECT str_goodn, str_goodv
    FROM storage
    ORDER BY str_goodn ASC");
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'GoodName' => $row['str_goodn'],
            'GoodValue' => $row['str_goodv'],
        ];
    }
}

$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>