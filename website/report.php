<?php
$servername = "localhost";
$username = "warbands";
$password = "";

// Connect to the database
$mysqli = new mysqli($servername, $username, $password, $username);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get the POST values
$mapname = $mysqli->real_escape_string($_POST["mapname"]);
$timeslot = (int) (((time() / 60) - 24) / 60);
$band = $mysqli->real_escape_string($_POST["band"]);
$dots = $mysqli->real_escape_string($_POST["dots"]);
$report = $mysqli->real_escape_string($_POST["report"]);

// Insert
$mysqli->query(
               "INSERT into maps (name,timeslot,band,dots,reports_on_710,last_report_text) " .
               "VALUES ('$mapname','$timeslot','$band','$dots', '1', '$report') " .
               "ON DUPLICATE KEY UPDATE reports_on_710=reports_on_710+1, " .
               "last_report_text=VALUES(last_report_text);"
               ) || die($mysqli->error);

$mysqli->close();
echo("Done at timeslot $timeslot");

$current_data = file_get_contents("http://nembibi.com/warbands_test/current_data3.php");
$file = fopen("current_data","w") or die("Could not open cache file for writing.");
fwrite($file, $current_data);
fclose($file);

file_get_contents("http://layrajha.com/warbands/update_content.php");

?>
