import time
import re,string
import httplib, urllib

print_debug = False

log_folder = r"J:\Steam\SteamApps\common\Path of Exile\logs"
log_name   = r"Client.txt"

maps = {
	68 : {"Crypt":None,"Desert":None,"Dunes":None,"Dungeon":None,"Grotto":None,"Pit":None,"Tropical Island":["Trop","Tropical","Island"],"Vaults of Atziri":["Vaults"]},
	69 : {"Arcade":None,"Cemetery":None,"Channel":None,"Mountain Ledge":["MLedge","Ledge","Mountain"],"Sewer":None,"Thicket":None,"Wharf":None,"Maelstrom of Chaos":["Maelstrom"],"Acton's Nightmare":["Acton","Actons"]},
	70 : {"Ghetto":None,"Mud Geyser":["Geyser"],"Museum":None,"Quarry":None,"Reef":None,"Spider Lair":["Spider","Lair"],"Vaal Pyramid":["Pyramid"],"Mao Kun":["Mao","Kun"],"The Apex of Sacrifice":["Apex","Atziri","Sacrifice"]},
	71 : {"Arena":None,"Overgrown Shrine":["Overgrown"],"Promenade":None,"Shore":None,"Spider Forest":["Spider","Forest"],"Tunnel":None},
	72 : {"Bog":None,"Coves":None,"Graveyard":None,"Pier":None,"Underground Sea":["Und","Underground","Udg","Sea"],"Villa":None,"Whakawairua Tuahu":["Whakawairua","Tuahu"]}, 
	73 : {"Arachnid Nest":["Arachnid","Arach","Nest"],"Catacomb":None,"Colonnade":None,"Dry Woods":["Dry","Woods"],"Temple":None,"Strand":None,"Poorjoy's Asylum":["Poorjoy","Poorjoys","Asylum"],"Olmec's Sanctum":["Olmec","Sanctum"]},
	74 : {"Jungle Valley":["Jungle","Valley"],"Labyrinth":None,"Mine":None,"Torture Chamber":["Torture","Chamber","Chambre"],"Waste Pool":["Waste","Pool"],"Oba's Cursed Trove":["Oba","Obas","Cursed","Curse","Trove"]},
	75 : {"Canyon":None,"Cells":None,"Dark Forest":["Dark","Forest"],"Dry Peninsula":["Peninsula"],"Orchard":None},
	76 : {"Arid Lake":["Arid","Lake"],"Gorge":None,"Residence":None,"Underground River":["Und","Underground","Udg","River"]},
	77 : {"Bazaar":None,"Necropolis":None,"Plateau":None,"Volcano":None},
	78 : {"Academy":None,"Crematorium":None,"Precinct":None,"Springs":None},
	79 : {"Arsenal":None,"Overgrown Ruin":["Overgrown","Ruin"],"Shipyard":None,"Village Ruin":["Village","Ruin"],"Vaal Temple":["Vaal Temple"]},
	80 : {"Courtyard":None,"Excavation":None,"Wasteland":None,"Waterways":None,"The Alluring Abyss":["Alluring"]},
	81 : {"Maze":None,"Palace":None,"Shrine":None},
	82 : {"Abyss":None,"Colosseum":None,"Core":None}
}

status = {}

def prepare_status():
	for level,maps_data in maps.iteritems():
		for map_name in maps_data.iterkeys():
			status[map_name] = {
				"level" : level,
				"reports" : [],
				"dots" : None,
				"band": None
			}

needs_two_words = [
	"Tropical Island","Spider Lair","Spider Forest","Underground Sea",
	"Dry Woods","Waste Pool","Oba's Cursed Trove","Dark Forest",
	"Arid Lake","Underground River","Overgrown Ruin","Village Ruin",
	"Vaal Temple","Mao Kun"
]

bands = {
	"Brinerot" : ["Lookouts", "Pillagers", "Buccaneers", "Captured"],
	"Redblade" : ["Scouts", "Raiders", "Fanatics", "Conquered"],
	"Mutewind" : ["Trackers", "Hunters", "Purifiers", "Cleansed"]
}

banned_words = ["if", "was", "were", "last", "may", "maybe", "might", "could", "perhaps", "what", "why", "when"]
banned_symbols = ["?"]

threshold_length_for_levenshtein1 = 5
threshold_length_for_levenshtein2 = 8

def levenshtein(s1, s2):
	if len(s1) < len(s2):
		return levenshtein(s2, s1)
	if len(s2) == 0:
		return len(s1)
	previous_row = range(len(s2) + 1)
	for i, c1 in enumerate(s1):
		current_row = [i + 1]
		for j, c2 in enumerate(s2):
			insertions = previous_row[j + 1] + 1
			deletions = current_row[j] + 1
			substitutions = previous_row[j] + (c1 != c2)
			current_row.append(min(insertions, deletions, substitutions))
		previous_row = current_row
	return previous_row[-1]

def test_lv(s1, s2):
	max_dist = 0
	if min(len(s1),len(s2)) >= threshold_length_for_levenshtein1:
		max_dist = 1
	if min(len(s1),len(s2)) >= threshold_length_for_levenshtein2:
		max_dist = 2
	return (levenshtein(s1.lower(),s2.lower()) <= max_dist)

def debug(str):
	if print_debug:
		print(str)

def update_html():
	with open("warbands.html","w") as f:
		f.write("<html>\n<head>\n  <title>Warbands Info Script</title>\n</head>\n")
		f.write("<body>\n")
		f.write("  <table>\n")
		f.write("    <tr><th>Map</th><th>Level</th><th>Band</th><th>Dots</th></tr>\n")
		for level in range(68,83):
			for map_name in maps[level].iterkeys():
				map_status = status[map_name]
				f.write("    <tr><td>%s</td><td>%d</td><td>%s</td><td>%s</td></tr>\n" % (map_name,map_status["level"],map_status["band"] or "?",str(map_status["dots"]) or "?"))
		f.write("  </table>\n")
		f.write("</body>\n")
		f.write("</html>\n")

def reset():
	prepare_status()

def found(map_name,band_name,dots,username,timestamp,log_line):
	if dots == 0:
		print(
			"=======> 0 dots in %s according to %s's message at t=%d" %
			(map_name,username,timestamp)
		)
	else:
		print(
			"=======> %s has %d dots in %s according to %s's message at t=%d" %
			(band_name or "A warband",dots,map_name,username,timestamp)
		)
	map_status = status[map_name]
	map_status["dots"] = dots
	map_status["band"] = band_name
	map_status["last_update"] = timestamp
	map_status["reports"].append([username,log_line])
	update_html()

	try:
		params = urllib.urlencode({'mapname': map_name.replace(' ','_'), 'band': band_name, 'dots': dots, 'report': log_line[:-2]})
		headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
		conn = httplib.HTTPConnection("nembibi.com", timeout=30)
		conn.request("POST", "/warbands_test/report.php", params, headers)
		response = conn.getresponse()
		print("Response:", response.status, response.reason)
		print(response.read())
		conn.close()
	except Exception as e:
		print(type(e))

# Handles one log line, returns true if it was considered to be a warbands report
def handle_line(line):
	# Remove special characters
	for banned_symbol in banned_symbols:
		if line.find(banned_symbol) >= 0:
			return
	data = re.sub(r"[^a-zA-Z0-9 #]", "", line).lower().split()
	if len(data) < 9:
		return
	timestamp = int(time.time())
	username  = data[7]
	if username[0] != "#":
		return
	username = username[1:-1]
	# Maybe we don't need to search for \w anymore since we remove special chars
	# before splitting the line
	words = [word.replace('#','') for word in data[8:] if re.search(r"\w",word)]

	# if the sentence was too long, it's likely a false positive, abort
	if len(words) > 7:
		return

	for banned_word in banned_words:
		if banned_word in words:
			return

	populations_found = []
	dots_found = []
	bands_found = []
	maps_found = []

	# Detects "3 dots", "4-d", "2dot" etc
	m = re.search(r"(?:\A|\W)(\d)[- ]?d(?:ots?)?(?:\Z|\W)",string.join(words))
	if m:
		dots = int(m.group(1))
		#debug("%d dots detected by %s at t=%d!" % (dots, username, timestamp))
		dots_found.append(int(dots))

	debug("===============================================================")
	debug(string.join(words))
	for word in words:
		# Detects occurences of a map/population/band name
		for band_name, populations in bands.iteritems():
			if test_lv(word,band_name):
				#debug("%s detected by %s at t=%d!" % (band_name, username, timestamp))
				bands_found.append(band_name)
			for population in populations:
				max_dist = 1
				if test_lv(word,population):
					#debug("(%s) %s detected by %s at t=%d!" % (band_name, population, username, timestamp))
					populations_found.append(population)
		for level,maps_data in maps.iteritems():
			for map_name,map_altnames in maps_data.iteritems():
				altnames = map_altnames
				if not altnames:
					altnames = [map_name]
				for altname in altnames:
					if test_lv(word,altname):
						#debug("%s detected by %s at t=%d!" % (map_name, username, timestamp))
						maps_found.append(map_name)
						break

		# Detects things like "B3" or "m4"
		m = re.search(r"^([brm])([1234])$",word,flags=re.I)
		if m:
			just_to_be_sure = False
			for band_name in bands.iterkeys():
				if m.group(1).lower() == band_name[0].lower():
					bands_found.append(band_name)
					just_to_be_sure = True
			if just_to_be_sure == False:
				print("==========================\nSomething weird happened\n==========================")
			dots_found.append(int(m.group(2)))

		# Detects the word "empty" / "clear" / etc
		if word in ["empty","clear","nothing"]:
			dots_found.append(0)
		
	# If nothing was detected, return
	if max(len(maps_found), len(populations_found), len(bands_found), len(dots_found)) == 0:
		return
		
	for map_name in maps_found:
		if map_name in needs_two_words:
			if maps_found.count(map_name) < 2:
				maps_found = [m for m in maps_found if m != map_name]
	
	# Remove duplicates in the lists of occurrences of everything
	populations_found = list(set(populations_found))
	dots_found        = list(set(dots_found))
	bands_found       = list(set(bands_found))
	maps_found        = list(set(maps_found))

	# Exception for map names that are a substring of another map's name and other dumb shit
	if ("Overgrown Shrine" in maps_found):
		if ("Shrine" in maps_found):
			maps_found.remove("Shrine")
		if ("Overgrown Ruin" in maps_found):
			maps_found.remove("Overgrown Shrine")
	if ("Vaal Temple" in maps_found) and ("Temple" in maps_found):
		maps_found.remove("Temple")
	if ("The Apex of Sacrifice" in maps_found) and ("Vaults of Atziri" in maps_found):
		maps_found.remove("The Apex of Sacrifice")
		
	# If there is a contradiction, return
	if max(len(maps_found), len(populations_found), len(bands_found), len(dots_found)) >= 2:
		debug("Ignored report: Detected too many of at least one of: maps, pops, bands or dots")
		return

	# Strip log line from what we don't care about
	log_line = "[%d] %s" % (timestamp, line.split(' ',7)[7])

	# Check if we have sufficient information and, if so, process the report
	if len(maps_found) == 1:
		m = maps_found[0]
		if len(populations_found) == 1:
			p = populations_found[0]
			if len(bands_found) == 1:
				b = bands_found[0]
				if p not in bands[b]:
					debug("Ignored report: Population didn't match band")
					return
				d = bands[b].index(p)+1
				found(m,b,d,username,timestamp,log_line)
				return True
			for b,populations in bands.iteritems():
				if p in populations:
					d = bands[b].index(p)+1
					found(m,b,d,username,timestamp,log_line)
					return True
		if len(dots_found) == 1:
			d = dots_found[0]
			if d == 0:
				found(m,None,d,username,timestamp,log_line)
				return True
			if len(bands_found) == 1:
				b = bands_found[0]
				found(m,b,d,username,timestamp,log_line)
				return True
			found(m,None,d,username,timestamp,log_line)
			return True
	debug("Ignored report: Not denough data")

minutes_reset = 3
def main():
	prepare_status()
	update_html()
	prev_minutes = int(time.time()/60) % 30
	with open(r"%s\%s" % (log_folder, log_name)) as f:
		f.seek(0,2)
		while True:
			minutes = int(time.time()/60) % 30
			if minutes == minutes_reset and prev_minutes != minutes:
				reset()
			prev_minutes = minutes
			where = f.tell()
			line = f.readline()
			if not line:
				time.sleep(1)
				f.seek(where)
			else:
				if handle_line(line):
					update_html()


main()
