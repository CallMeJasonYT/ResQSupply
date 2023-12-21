<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$stmtSelect = $conn->prepare(
    "SELECT task_id, task_status, X(task_loc) AS lat, Y(task_loc) AS lon
    FROM tasks");

$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row["task_status"] != "Completed") {
            $response[] = [
                'task_id' => $row['task_id'],
                'lat' => $row['lat'],
                'lon' => $row['lon']
            ];
        }
    }
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>