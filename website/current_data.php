<?php
$timeslot = (int) (((time() / 60) - 24) / 60);

$dbh = new PDO('mysql:host=localhost;dbname=warbands', 'root', '');

$warbands = $dbh -> prepare('SELECT name,band,dots,reports_on_710,last_report_text FROM maps WHERE timeslot=:timeslot');

$warbands -> execute([':timeslot' => $timeslot]);
$current = $warbands -> fetchAll(PDO::FETCH_ASSOC);
$warbands -> execute([':timeslot' => $timeslot-1]);
$previous = $warbands -> fetchAll(PDO::FETCH_ASSOC);

$warbands = json_encode([$current, $previous]);
$file = file_put_contents('current_data.json', $warbands);