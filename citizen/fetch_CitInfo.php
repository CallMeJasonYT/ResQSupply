<?php
session_start();

$response = $_SESSION["username"];

header('Content-Type: application/json');
echo json_encode($response);
?>