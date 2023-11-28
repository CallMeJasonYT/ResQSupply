<?php

session_start();

$response["username"] = $_SESSION["username"];
$response["id"] = $_SESSION["id"];

header('Content-Type: application/json');
echo json_encode($response);

?>