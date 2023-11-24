<?php

$sname = "localhost";
$unmae = "root";
$password = "";
$db_name = "resqsupply";
$conn = mysqli_connect($sname, $unmae, $password, $db_name);
$response = [];

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Fetch announcements from the database
$query = "SELECT ann_id, ann_title, ann_text, ann_date FROM announcements";
$result = mysqli_query($conn, $query);

// Check if announcements exist
if (mysqli_num_rows($result) > 0) {
    // Fetch each row and add it to the response array
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
} else {
    $response = "False";
}

// Close the connection
mysqli_close($conn);

// Set the appropriate headers
header('Content-Type: application/json');

// Encode and echo the response
echo json_encode($response);
?>