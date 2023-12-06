<?php
session_destroy();
session_start();

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if(!$conn) {
    echo "Connection failed!";
}

$data = file_get_contents("php://input");

$RegData = json_decode($data);

$username = $RegData->username;
$fullname = $RegData->fullname;
$phone = $RegData->phone;
$address = $RegData->address;
$pass = $RegData->password;

if(isset($RegData->email)) {
    $email = $RegData->email;
} else {
    $email = null;
}

$_SESSION["username"] = $username;

$check_result = true;
while($check_result) {
    $id = mt_rand(100000000, 999999999);
    $fetch_id = mysqli_query($conn, "SELECT user_id FROM users WHERE user_id='$id'");
    $check_result = mysqli_num_rows($fetch_id);
}

$registration_user = mysqli_query($conn, "INSERT INTO users (user_id, username, password) VALUES('$id', '$username', '$pass')");
$_SESSION["id"] = $id;
$registration_citizen = mysqli_query($conn, "INSERT INTO citizen (cit_id, cit_fullname, cit_tel, cit_email, cit_addr) VALUES ('$id', '$fullname', '$phone', '$email', '$address')");

$conn->close();

?>