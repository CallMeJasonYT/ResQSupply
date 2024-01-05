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
    "SELECT str_goodn, str_goodv, cat_name
    FROM storage
    INNER JOIN goods ON str_goodn = good_name
    INNER JOIN categories ON good_cat_id = cat_id"
);

$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'GoodName' => $row['str_goodn'],
            'GoodValue' => $row['str_goodv'],
            'GoodCategory' => $row['cat_name'],
            'location' => 'Base'
        ];
    }
}

$stmtSelect = $conn->prepare(
    "SELECT load_goodn, load_goodv, cat_name, load_veh
    FROM loads
    INNER JOIN goods ON load_goodn = good_name
    INNER JOIN categories ON good_cat_id = cat_id"
);

$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'GoodName' => $row['load_goodn'],
            'GoodValue' => $row['load_goodv'],
            'GoodCategory' => $row['cat_name'],
            'location' => 'Truck: ' . $row['load_veh']
        ];
    }
}

$stmtSelect->close();

usort($response, function ($a, $b) {
    return strcmp($a['GoodName'], $b['GoodName']);
});

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>