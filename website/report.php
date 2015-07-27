<?php
$dbh = new PDO('mysql:host=localhost;dbname=warbands', 'root', '');

$timeslot = (int) (((time() / 60) - 24) / 60);

// Insert
$insert = $dbh -> prepare ("INSERT into maps (name,timeslot,band,dots,reports_on_710,last_report_text) " .
               "VALUES (:mapname,:timeslot,:band,:dots, '1', :report) " .
               "ON DUPLICATE KEY UPDATE reports_on_710=reports_on_710+1, " .
               "last_report_text=VALUES(last_report_text);");

$insert -> execute([':mapname' => $_POST['mapname'],
                   ':timeslot' => $timeslot,
                   ':band' => $_POST['band'],
                   ':dots' => $_POST['dots'],
                   ':report' => $_POST['dots']
                   ]);

file_put_contents('current_data.json', file_get_contents('update_JSON.php'));