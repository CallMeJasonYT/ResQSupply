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

$labels = [];
$newOffersData = [];
$newRequestsData = [];
$completedOffersData = [];
$completedRequestsData = [];

foreach ($resultSet1 as $row) {
    $labels[] = $row['task_date'];
    $newOffersData[] = $row['offer_count'];
}

foreach ($resultSet2 as $row) {
    $newRequestsData[] = $row['request_count'];
}

foreach ($resultSet3 as $row) {
    $completedOffersData[] = $row['offer_pickup'];
}

foreach ($resultSet4 as $row) {
    $completedRequestsData[] = $row['request_pickup'];
}

$data = [
    'labels' => $labels,
    'datasets' => [
        [
            'label' => 'New Offers',
            'data' => $newOffersData,
            'backgroundColor' => ['rgba(200, 0, 71, 0.2)'],
            'borderColor' => ['rgba(200, 0, 71, 1)'],
            'borderWidth' => 1,
        ],
        [
            'label' => 'New Requests',
            'data' => $newRequestsData,
            'backgroundColor' => ['rgba(200, 219, 255, 0.2)'],
            'borderColor' => ['rgba(200, 219, 255, 1)'],
            'borderWidth' => 1,
        ],
        [
            'label' => 'Completed Offers',
            'data' => $completedOffersData,
            'backgroundColor' => ['rgba(149, 95, 255, 0.2)'],
            'borderColor' => ['rgba(149, 95, 255, 1)'],
            'borderWidth' => 1,
        ],
        [
            'label' => 'Completed Requests',
            'data' => $completedRequestsData,
            'backgroundColor' => ['rgba(136, 255, 133, 0.2)'],
            'borderColor' => ['rgba(136, 255, 133, 1)'],
            'borderWidth' => 1,
        ],
    ],
];

header('Content-Type: application/json');
echo json_encode($data);
?>
