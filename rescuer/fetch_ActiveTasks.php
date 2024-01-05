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
$veh = $_SESSION['veh_id'];

$stmtSelect = $conn->prepare(
    "SELECT cit_fullname, cit_tel, task_date_create, task_goodn, task_goodv, task_id, task_cat
    FROM citizen 
    INNER JOIN tasks 
    ON cit_id = task_cit_id
    WHERE task_status = 'Executing' && task_veh = ?"
);
$stmtSelect->bind_param("s", $veh);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'fullname' => $row['cit_fullname'],
            'telephone' => $row['cit_tel'],
            'creationDate' => $row['task_date_create'],
            'goodName' => $row['task_goodn'],
            'goodValue' => $row['task_goodv'],
            'id' => $row['task_id'],
            'category' => $row['task_cat'],
        ];
    }
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>