<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
    echo "Connection failed!";
}

if (isset($_POST["phone"])) {
    $username = $_POST["username"];
    $fullname = $_POST["fullname"];
    $phone = $_POST["phone"];
    $address = $_POST["address"];
    $pass = $_POST["password"];
    $address = $_POST["address"];
    if (isset($_POST["email"])) {
        $email = $_POST["email"];
    } else {
        $email = NULL;
    }

    $check_result = 1;
    while ($check_result != NULL) {
        $id = mt_rand(100000000, 999999999);
        $fetch_id = $conn->execute_query("SELECT user_id FROM users WHERE user_id=?", [$id]);
        $check_result = $fetch_id->fetch_assoc();
    }
    if ($check_result == NULL) {
        $registration_user = $conn->execute_query("INSERT INTO users (user_id, username, password) 
        VALUES(?, ?, ?)", [$id, $username, $pass]);
        $registration_citizen = $conn->execute_query("INSERT INTO citizen (cit_id, cit_fullname, cit_tel, cit_email, cit_addr) 
        VALUES (?, ?, ?, ?, ?)", [$id, $fullname, $phone, $email, $address]);
    }
} else {
    $username = $_POST["username"];
    $pass = $_POST["password"];
}

?>