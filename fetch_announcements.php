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
$query = "SELECT ann_id, ann_title, ann_text, ann_date, needs_goodn FROM announcements INNER JOIN needs WHERE ann_id=needs_ann_id";
$result = mysqli_query($conn, $query);

// Check if announcements exist
if (mysqli_num_rows($result) > 0) {

    // Create an array to store the grouped data
    $groupedData = array();

    // Fetch each row and add it to the response array
    while ($row = mysqli_fetch_assoc($result)) {
        // Use ann_id as the key to group items
        $key = $row['ann_id'];

        // If the key doesn't exist in groupedData, create an array for it
        if (!isset($groupedData[$key])) {
            $groupedData[$key] = $row;
            $groupedData[$key]['needs_goodn'] = array($row['needs_goodn']);
        } else {
            // If the key exists, push the needs_goodn value to the existing array
            $groupedData[$key]['needs_goodn'][] = $row['needs_goodn'];
        }
    }
    // Convert the values of groupedData back to an array
    $response = array_values($groupedData);
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
