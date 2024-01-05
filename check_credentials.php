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
$loginData = json_decode($data);
$username = $loginData->username;
$password = $loginData->password;

$stmtSelect = $conn->prepare("SELECT category, user_id FROM users WHERE username = ? AND password = ?");
$stmtSelect->bind_param("ss", $username, $password);
$stmtSelect->execute();
$result = $stmtSelect->get_result();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response = $row["category"];
        $_SESSION["username"] = $username;
        $_SESSION["id"] = $row["user_id"];
    }
} else {
    $response = "False";
    session_destroy();
}
$stmtSelect->close();

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>