alternative.html           wrapper for mirror_warbands.html
current_data.json          contains the current JSON data
index.html                 the webpage
mirror_warbands.html       is on the mirror website and is just the
                           same as index.html, but pointing to the main
                           host instead of pointing to the mirror
report.php                 receives reports from the python script, updates
                           the DB with these reports and calls update_JSON.php
                           when it is done
reset_timer                contains a number which is the number of
                           minutes after the hour at which the warbands
                           reset
update_JSON.php            updates current_data.json with data from the DB
update_reset_timer.php     updates reset_timer (triggered by the users of the
                           python scripts)
