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
$requestData = json_decode($data);
$continue = true;
$veh = $_SESSION['veh_id'];
$taskId = $requestData->taskId;

$stmtSelect = $conn->prepare("SELECT task_goodn, task_goodv, task_cat FROM tasks WHERE task_id = ?");
$stmtSelect->bind_param("i", $taskId);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $goodname = $row['task_goodn'];
        $goodvalue = $row['task_goodv'];
        $category = $row['task_cat'];
    }
}
$stmtSelect->close();

$stmtSelect = $conn->prepare("SELECT load_goodv FROM loads WHERE load_veh = ? && load_goodn = ?");
$stmtSelect->bind_param('ss', $veh, $goodname);
$stmtSelect->execute();
$stmtSelect->bind_result($goodvalueload);

if ($stmtSelect->fetch()) {
    $stmtSelect->close();
    if ($category == 'Request') {
        if ($goodvalueload >= $goodvalue) {
            $newvalue = $goodvalueload - $goodvalue;
            if ($newvalue != 0) {
                $stmtUpdate = $conn->prepare("UPDATE loads SET load_goodv = ? WHERE load_veh = ? && load_goodn = ?");
                $stmtUpdate->bind_param("iss", $newvalue, $veh, $goodname);
                $stmtUpdate->execute();
                $stmtUpdate->close();
            } else {
                $stmtDelete = $conn->prepare("DELETE FROM loads WHERE load_goodn = ? && load_veh = ?");
                $stmtDelete->bind_param('ss', $goodname, $veh);
                $stmtDelete->execute();
                $stmtDelete->close();
            }
        } else {
            $continue = false;
        }
    } else {
        $newvalue = $goodvalueload + $goodvalue;
        $stmtUpdate = $conn->prepare("UPDATE loads SET load_goodv = ? WHERE load_veh = ? && load_goodn = ?");
        $stmtUpdate->bind_param("iss", $newvalue, $veh, $goodname);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    }
} else {
    if ($category == 'Request') {
        $continue = false;
    } else {
        $stmtInsert = $conn->prepare("INSERT INTO loads (load_goodv, load_veh, load_goodn) VALUES (?,?,?)");
        $stmtInsert->bind_param("iss", $goodvalue, $veh, $goodname);
        $stmtInsert->execute();
        $stmtInsert->close();
    }
}

if ($continue) {
    $stmtUpdate = $conn->prepare("UPDATE tasks SET task_status = 'Completed', task_complete = CURRENT_TIMESTAMP WHERE task_id = ?");
    $stmtUpdate->bind_param("i", $taskId);
    $stmtUpdate->execute();
    $stmtUpdate->close();
}

header('Content-Type: application/json');
echo json_encode($response = $continue);
$conn->close();
?>