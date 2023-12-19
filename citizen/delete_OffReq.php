<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = '';

$data = file_get_contents("php://input");

$offReqData = json_decode($data);
$id = $offReqData->id;

$querySel = "SELECT task_status FROM tasks WHERE task_id = ?";
$stmtSel = mysqli_prepare($conn, $querySel);
mysqli_stmt_bind_param($stmtSel, "i", $id);
mysqli_stmt_execute($stmtSel);
$result = mysqli_stmt_get_result($stmtSel);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row['task_status'] == 'Pending') {
            $queryDel = "DELETE FROM tasks WHERE task_id = ?";
            $stmtDel = mysqli_prepare($conn, $queryDel);
            mysqli_stmt_bind_param($stmtDel, "i", $id);
            mysqli_stmt_execute($stmtDel);
        } else
            $response = "False";
    }
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>