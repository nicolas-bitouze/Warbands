<?php
$dbh = new PDO('mysql:host=localhost;dbname=warbands', 'warbands', 'xqsdft1xqsdft=');

$reset = (int) trim(file_get_contents('reset_timer'));
$timeslot = (int) (((time() / 60) - $reset) / 60);

// Insert
$insert = $dbh -> prepare ("INSERT into maps (name,timeslot,band,dots,reports_on_710,last_report_text) " .
               "VALUES (:mapname,:timeslot,:band,:dots, '1', :report) " .
               "ON DUPLICATE KEY UPDATE reports_on_710=reports_on_710+1, " .
                           "last_report_text=VALUES(last_report_text);");

$insert -> execute([':mapname' => $_POST['mapname'],
                    ':timeslot' => $timeslot,
                    ':band' => $_POST['band'],
                    ':dots' => $_POST['dots'],
                    ':report' => $_POST['report']
                    ]);

file_get_contents('http://localhost/warbands/update_JSON.php');

// update mirrors too
file_get_contents('http://layrajha.com/warbands/update_JSON.php');
