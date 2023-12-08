<?php
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

if(!$conn) {
    die("Connection failed: ".mysqli_connect_error());
}

$stmtSelect = $conn->prepare("SELECT base_name, base_loc FROM base");

$stmtSelect->execute();
$result = $stmtSelect->get_result();

if(mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'basename' => $row['base_name'],
            'address' => $row['base_loc'],
            'category' => 'Base'
        ];
    }
}

$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>