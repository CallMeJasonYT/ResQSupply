<?php
session_start();

if(!isset($_SESSION["category"]) || $_SESSION["category"] != 'admin'){
    session_destroy();
    header('Content-Type: application/json');
    echo json_encode("False");
    exit;
}else{
    $response = $_SESSION["username"];
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>