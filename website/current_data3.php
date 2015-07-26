<?php
$servername = "localhost";
$username = "warbands";
$password = ""; // password

// Connect to the database
$connection = new mysqli($servername, $username, $password, $username);
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$timeslot = (int) (((time() / 60) - 24) / 60);

// Select
$result = $connection->query(
                             "SELECT name,band,dots,reports_on_710,last_report_text from maps " .
                             "WHERE timeslot='$timeslot';"
                             );
$firstline = true;

ob_start();

echo('[[');
while ($row = $result->fetch_assoc()) {
    if($firstline) {
        $firstline = false;
    } else {
        echo(',');
    }
    echo(json_encode($row));
}
echo('],[');
$timeslot = $timeslot - 1;
$result = $connection->query(
                             "SELECT name,band,dots,reports_on_710,last_report_text from maps " .
                             "WHERE timeslot='$timeslot';"
                             );
$firstline = true;
while ($row = $result->fetch_assoc()) {
    if($firstline) {
        $firstline = false;
    } else {
        echo(',');
    }
    echo(json_encode($row));
}
echo(']]');

ob_get_contents();
ob_end_flush();

$connection->close();
?>
