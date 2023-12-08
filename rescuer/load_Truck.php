<?php

session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

$data = file_get_contents("php://input");

$dataArray = json_decode($data, true);

$veh = $_SESSION['veh_id'];

foreach($dataArray['data'] as $data) {
    $itemText = $data['itemText'];
    $itemQ = $data['itemQ'];

    $stmtSelect = $conn->prepare("SELECT load_goodv FROM loads WHERE load_goodn = ? && load_veh = ?");
    $stmtSelect->bind_param('ss', $itemText, $veh);
    $stmtSelect->execute();
    $stmtSelect->bind_result($currentLoadGoodv);

    if($stmtSelect->fetch()) {
        $stmtSelect->close();
        $newLoadGoodv = $currentLoadGoodv + $itemQ;
        $stmtUpdate = $conn->prepare("UPDATE loads SET load_goodv = ? WHERE load_goodn = ? && load_veh = ?");
        $stmtUpdate->bind_param('iss', $newLoadGoodv, $itemText, $veh);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    } else {
        $itemText = $data['itemText'];
        $itemQ = $data['itemQ'];

        $stmt = $conn->prepare("INSERT INTO loads (load_veh, load_goodn, load_goodv) VALUES (?, ?, ?)");
        $stmt->bind_param('ssi', $veh, $itemText, $itemQ);
        $stmt->execute();
        $stmt->close();
    }
}

foreach($dataArray['data'] as $data) {
    $itemText = $data['itemText'];
    $itemQ = $data['itemQ'];

    $stmtSelect = $conn->prepare("SELECT str_goodv FROM storage WHERE str_goodn = ?");
    $stmtSelect->bind_param('s', $itemText);
    $stmtSelect->execute();
    $stmtSelect->bind_result($currentStrGoodv);

    if($stmtSelect->fetch()) {
        $stmtSelect->close();
        $newStrGoodv = $currentStrGoodv - $itemQ;
        $stmtUpdate = $conn->prepare("UPDATE storage SET str_goodv = ? WHERE str_goodn = ?");
        $stmtUpdate->bind_param('is', $newStrGoodv, $itemText);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    }
}

$response = "OK";
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>