<?php
$timeslot = (int) (((time() / 60)) / 60);

$dbh = new PDO('mysql:host=localhost;dbname=warbands', 'root', '');

$warbands = $dbh -> prepare('SELECT name,band,dots,reports_on_710,last_report_text FROM maps WHERE timeslot=:timeslot AND (band!="none" AND dots>0) GROUP BY name');

for($ts = 399362; $ts <= $timeslot;  $ts++){
  $warbands -> execute([':timeslot' => $ts]);
  $current = $warbands -> fetchAll(PDO::FETCH_ASSOC);
  $data = json_encode(['maps' => $current, 'timeslot' => $ts]);
  $file = file_put_contents('legacy/data_'.$ts.'.json', $data);
}