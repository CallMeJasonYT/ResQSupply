<?php

$sname = "localhost";
$uname = "root";
$password = "";
$db_name = "resqsupply";
$conn = new mysqli($sname, $uname, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmtSelect = $conn->prepare(
    "SELECT DATE(task_date_create) AS task_date, COUNT(*) AS offer_count
    FROM tasks
    WHERE task_cat = 'Offer'
    GROUP BY DATE(task_date_create);");

$stmtSelect->execute();
$resultSet1 = $stmtSelect->get_result()->fetch_all(MYSQLI_ASSOC);
$stmtSelect->close();

$stmtSelect = $conn->prepare(
    "SELECT DATE(task_date_create) AS task_date, COUNT(*) AS request_count
    FROM tasks
    WHERE task_cat = 'Request'
    GROUP BY DATE(task_date_create);");

$stmtSelect->execute();
$resultSet2 = $stmtSelect->get_result()->fetch_all(MYSQLI_ASSOC);
$stmtSelect->close();

$stmtSelect = $conn->prepare(
    "SELECT DATE(task_date_pickup) AS task_pickup, COUNT(*) AS offer_pickup
    FROM tasks
    WHERE task_cat = 'Offer'
    GROUP BY DATE(task_date_pickup);");

$stmtSelect->execute();
$resultSet3 = $stmtSelect->get_result()->fetch_all(MYSQLI_ASSOC);
$stmtSelect->close();

$stmtSelect = $conn->prepare(
    "SELECT DATE(task_date_pickup) AS task_pickup, COUNT(*) AS request_pickup
    FROM tasks
    WHERE task_cat = 'Request'
    GROUP BY DATE(task_date_pickup);");

$stmtSelect->execute();
$resultSet4 = $stmtSelect->get_result()->fetch_all(MYSQLI_ASSOC);
$stmtSelect->close();

$newOffersData = [];
$newRequestsData = [];
$completedOffersData = [];
$completedRequestsData = [];

foreach ($resultSet1 as $row) {
    $newOffersData['count'][$row['task_date']] = $row['offer_count'];
}

foreach ($resultSet2 as $row) {
    $newRequestsData['count'][$row['task_date']] = $row['request_count'];
}

foreach ($resultSet3 as $row) {
    $completedOffersData['count'][$row['task_pickup']] = $row['offer_pickup'];
}

foreach ($resultSet4 as $row) {
    $completedRequestsData['count'][$row['task_pickup']] = $row['request_pickup'];
}

$data = [
    'datasets' => [
        [
            'label' => 'New Offers',
            'data' => $newOffersData,
        ],
        [
            'label' => 'New Requests',
            'data' => $newRequestsData,
        ],
        [
            'label' => 'Completed Offers',
            'data' => $completedOffersData,
        ],
        [
            'label' => 'Completed Requests',
            'data' => $completedRequestsData,
        ],
    ]
];

header('Content-Type: application/json');
echo json_encode($data);
?>