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
    "SELECT good_name
    FROM goods
    ORDER BY good_name ASC"
);

$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'GoodName' => $row['good_name'],
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>