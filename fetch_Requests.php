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

$task_cat = "Request";

// Fetch Requests from the database
$query = "SELECT task_id, task_date_create, task_goodn, task_date_pickup, task_goodv, task_status FROM tasks INNER JOIN users ON user_id=task_cit_id WHERE username=? AND task_cat=?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "ss", $_SESSION["username"], $task_cat);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

// Check if Requests exist
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
mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>