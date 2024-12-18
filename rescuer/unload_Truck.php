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
$dataArray = json_decode($data, true);
$response = [];
$veh = $_SESSION['veh_id'];

foreach ($dataArray['data'] as $data) {
    $itemText = $data['itemText'];
    $itemQ = $data['itemQ'];

    $stmtSelect = $conn->prepare("SELECT str_goodv FROM storage WHERE str_goodn = ?");
    $stmtSelect->bind_param('s', $itemText);
    $stmtSelect->execute();
    $stmtSelect->bind_result($currentStrGoodv);

    if ($stmtSelect->fetch()) {
        $stmtSelect->close();

        $newStrGoodv = $currentStrGoodv + $itemQ;
        $stmtUpdate = $conn->prepare("UPDATE storage SET str_goodv = ? WHERE str_goodn = ?");
        $stmtUpdate->bind_param('is', $newStrGoodv, $itemText);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    } else {
        $stmtSelect->close();

        $stmtInsert = $conn->prepare("INSERT INTO storage (str_goodn, str_goodv) VALUES (?, ?)");
        $stmtInsert->bind_param('si', $itemText, $itemQ);
        $stmtInsert->execute();
        $stmtInsert->close();
    }
}

foreach ($dataArray['data'] as $data) {
    $itemText = $data['itemText'];
    $itemQ = $data['itemQ'];

    $stmtSelect = $conn->prepare("SELECT load_goodv FROM loads WHERE load_veh = ? && load_goodn = ?");
    $stmtSelect->bind_param('ss', $veh, $itemText);
    $stmtSelect->execute();
    $stmtSelect->bind_result($currentLoadGoodv);

    if ($stmtSelect->fetch()) {
        $stmtSelect->close();
        $newLoadGoodv = $currentLoadGoodv - $itemQ;
        if ($newLoadGoodv != 0) {
            $stmtUpdate = $conn->prepare("UPDATE loads SET load_goodv = ? WHERE load_goodn = ? && load_veh = ?");
            $stmtUpdate->bind_param('iss', $newLoadGoodv, $itemText, $veh);
            $stmtUpdate->execute();
            $stmtUpdate->close();
        } else {
            $stmtDelete = $conn->prepare("DELETE FROM loads WHERE load_goodn = ? && load_veh = ?");
            $stmtDelete->bind_param('ss', $itemText, $veh);
            $stmtDelete->execute();
            $stmtDelete->close();
        }
    }
}

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>