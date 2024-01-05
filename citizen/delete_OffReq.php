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

$data = file_get_contents("php://input");
$offReqData = json_decode($data);
$response = [];
$id = $offReqData->id;

$stmtSelect = $conn->prepare("SELECT task_status FROM tasks WHERE task_id = ?");
$stmtSelect->bind_param("i", $id);
$stmtSelect->execute();
$result = $stmtSelect->get_result();


if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row['task_status'] == 'Pending') {
            $stmtDelete = $conn->prepare("DELETE FROM tasks WHERE task_id = ?");
            $stmtDelete->bind_param("i", $id);
            $stmtDelete->execute();
            $stmtDelete->close();
        } else {
            $response = "False";
        }
    }
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>