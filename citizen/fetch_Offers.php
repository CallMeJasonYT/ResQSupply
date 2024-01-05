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
    "SELECT task_id, task_date_create, task_goodn, task_date_pickup, task_goodv, task_status FROM tasks 
    INNER JOIN users ON user_id = task_cit_id 
    WHERE username = ? AND task_cat = 'Offer' 
    ORDER BY task_date_create DESC"
);
$stmtSelect->bind_param("s", $_SESSION["username"]);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'task_id' => $row['task_id'],
            'task_date_create' => $row['task_date_create'],
            'task_goodn' => $row['task_goodn'],
            'task_goodv' => $row['task_goodv'],
            'task_date_pickup' => $row['task_date_pickup'],
            'task_status' => $row['task_status']
        ];
    }
} else {
    $response = "False";
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>