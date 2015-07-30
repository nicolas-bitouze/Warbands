var updateDataInterval = 20;
	var updateTimerInterval = 10;
	var reset = 23.5;

	var numTimerUpdatesBetweenDataUpdates = Math.floor(updateDataInterval / updateTimerInterval);
	var timestampOffset = (new Date()).getTimezoneOffset() * 1000;
	
	var allMapData = {};
	
	var currentSlot = 1;
	var firstTimeSwitch = true;

	var bandShortcuts = {
		"Mutewind" : "m", "Brinerot" : "b", "Redblade" : "r"
	};
	
	// ---------------------------------------------------------------
	// Draw the arrows
				
	function intersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
		var denominator, a, b, numerator1, numerator2;
		denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
		if (denominator == 0) {
			return false;
		}
		a = line1StartY - line2StartY;
		b = line1StartX - line2StartX;
		numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
		numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
		a = numerator1 / denominator;
		b = numerator2 / denominator;

		if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
			return {
				x : line1StartX + (a * (line1EndX - line1StartX)),
				y : line1StartY + (a * (line1EndY - line1StartY))
			};
		} else {
			return false;
		}
	};
	
	function sides(rect) {
		return {
			left   : {x1:rect.left , y1:rect.top   , x2:rect.left , y2:rect.bottom},
			bottom : {x1:rect.left , y1:rect.bottom, x2:rect.right, y2:rect.bottom},
			right  : {x1:rect.right, y1:rect.bottom, x2:rect.right, y2:rect.top   },
			top    : {x1:rect.right, y1:rect.top   , x2:rect.left , y2:rect.top   }
		};
	}
	
	function drawRect(ctx,rect) {
		ctx.beginPath();
		ctx.moveTo(rect.left ,rect.top   );
        ctx.lineTo(rect.left ,rect.bottom);
		ctx.lineTo(rect.right,rect.bottom);
		ctx.lineTo(rect.right,rect.top   );
		ctx.lineTo(rect.left ,rect.top   );
		ctx.stroke();
	}
	
	function scaledRotated(vectX,vectY,theta,length) {
		var x = vectX * Math.cos(theta) - vectY*Math.sin(theta);
		var y = vectX * Math.sin(theta) + vectY*Math.cos(theta);
		var currentLength = Math.sqrt(x*x+y*y);
		return {
			x : x * length / currentLength,
			y : y * length / currentLength
		};
	}
	
	function getRelativeBoundingRect(element) {
		var canvas = document.getElementById("canvas");
		var spanboxdiv = document.getElementById("spanbox");
		var ctxoffsetLeft = canvas.offsetLeft - spanboxdiv.offsetLeft;
		var ctxoffsetTop  = canvas.offsetTop  - spanboxdiv.offsetTop;
		return {
			left   : element.offsetLeft - ctxoffsetLeft,
			top    : element.offsetTop  - ctxoffsetTop,
			right  : element.offsetLeft + element.offsetWidth  - ctxoffsetLeft,
			bottom : element.offsetTop  + element.offsetHeight - ctxoffsetTop
		}
	}
	
	function drawArrow(ctx,fromElem,toElem) {
		var fromRect = getRelativeBoundingRect(fromElem); //.getBoundingClientRect();
		var toRect   = getRelativeBoundingRect(toElem);   //.getBoundingClientRect();
		var fromCenterX = (fromRect.left   + fromRect.right) / 2;
		var fromCenterY = (fromRect.bottom + fromRect.top  ) / 2;
		var toCenterX   = (toRect.left     + toRect.right  ) / 2;
		var toCenterY   = (toRect.bottom   + toRect.top    ) / 2;

		// drawRect(ctx,fromRect);
		// drawRect(ctx,toRect);
		
		var fromSides = sides(fromRect);
		var toSides   = sides(toRect);
		var fromInter, toInter;
		for(var i in fromSides) {
			fromInter = intersection(
				fromCenterX, fromCenterY, toCenterX, toCenterY,
				fromSides[i].x1, fromSides[i].y1, fromSides[i].x2, fromSides[i].y2
			);
			if(fromInter) break;
		}
		for(var i in toSides) {
			toInter = intersection(
				fromCenterX, fromCenterY, toCenterX, toCenterY,
				toSides[i].x1, toSides[i].y1, toSides[i].x2, toSides[i].y2
			);
			if(toInter) break;
		}
		
		ctx.beginPath();
        ctx.moveTo(fromInter.x,fromInter.y);
        ctx.lineTo(toInter.x,  toInter.y  );
        ctx.stroke();
		
		var theta = 20;
		var arrowLength = 9;
		var ratio = 0.7;
		var vectX, vectY, vect1, vect2, vect3;
		vectX = fromInter.x - toInter.x;
		vectY = fromInter.y - toInter.y;
		vect1 = scaledRotated(vectX, vectY,  Math.PI/180*theta,arrowLength);
		vect2 = scaledRotated(vectX, vectY,  0                ,arrowLength*ratio);
		vect3 = scaledRotated(vectX, vectY, -Math.PI/180*theta,arrowLength);
		ctx.beginPath();
		ctx.moveTo(toInter.x, toInter.y);
		ctx.lineTo(toInter.x+vect1.x, toInter.y+vect1.y);
		ctx.lineTo(toInter.x+vect2.x, toInter.y+vect2.y);
		ctx.lineTo(toInter.x+vect3.x, toInter.y+vect3.y);
		ctx.fill();
		
		vectX = -vectX; vectY = -vectY;
		vect1 = scaledRotated(vectX, vectY,  Math.PI/180*theta,arrowLength);
		vect2 = scaledRotated(vectX, vectY,  0                ,arrowLength*ratio);
		vect3 = scaledRotated(vectX, vectY, -Math.PI/180*theta,arrowLength);
		ctx.beginPath();
		ctx.moveTo(fromInter.x, fromInter.y);
		ctx.lineTo(fromInter.x+vect1.x, fromInter.y+vect1.y);
		ctx.lineTo(fromInter.x+vect2.x, fromInter.y+vect2.y);
		ctx.lineTo(fromInter.x+vect3.x, fromInter.y+vect3.y);
		ctx.fill();
	}

	var arrows = [
		["Dungeon", "Channel", "Spider_Lair", "Overgrown_Shrine", "Pier", 
		"Arachnid_Nest", "Waste_Pool", "Canyon", "Arid_Lake", "Plateau",
		"Precinct", "Overgrown_Ruin", "Courtyard", "Shrine", "Abyss"],
		["Grotto", "Thicket", "Vaal_Pyramid", "Tunnel", "Bog", "Strand",
		"Mine", "Dark_Forest", "Gorge", "Bazaar", "Academy", "Village_Ruin",
		"Excavation", "Maze", "Colosseum"],
		["Dunes", "Mountain_Ledge", "Reef", "Shore", "Graveyard",
		"Dry_Woods", "Jungle_Valley", "Dry_Peninsula", "Residence",
		"Volcano", "Springs", "Arsenal", "Waterways", "Palace", "Core"],
		["Pit", "Cemetery", "Quarry", "Spider_Forest", "Coves", "Colonnade",
		"Labyrinth", "Orchard", "Underground_River", "Necropolis", 
		"Crematorium", "Shipyard", "Wasteland", "Palace"],
		["Tropical_Island", "Arcade", "Mud_Geyser", "Promenade", "Villa",
		"Catacomb", "Torture_Chamber", "Cells", "Underground_River"],
		["Crypt", "Sewer", "Ghetto", "Arena", "Underground_Sea", "Temple",
		"Torture_Chamber"],
		["Desert", "Wharf", "Museum", "Arena"]
	];

	function drawAllArrows() {
		var ctx = document.getElementById("canvas").getContext("2d");
		var j;
		for(var i in arrows) {
			for(j=0; j<arrows[i].length-1; j++) {
				drawArrow(ctx, document.getElementById("mapdiv_" + arrows[i][j]), document.getElementById("mapdiv_" + arrows[i][j+1]));
			}
		}
	}
	
	// ---------------------------------------------------------------
	// Fetch, parse and apply data
	
	function setMapDots(map, code, report) {
		document.getElementById("mapdiv_" + map).firstChild.firstChild.className = "map_" + code;
		var matches = report.match(/\[(\d+)\] (.*)/);
		if(matches) {
			var timestamp = parseInt(matches[1]);
			var date = new Date(timestamp*1000 + timestampOffset);
			var dateString = (date.getHours()<10?"0":"") + date.getHours() + ":" + (date.getMinutes()<10?"0":"") + date.getMinutes();
			document.getElementById("report_" + map).innerHTML = dateString + "\n<br />\n" + matches[2];
		} else {
			document.getElementById("report_" + map).innerHTML = "";
		}
	}
	
	function loadData(handler) {
		var myRequest = new XMLHttpRequest();
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "current_data.json", true);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					handler(xhr.responseText);
				} else {
					console.error(xhr.statusText);
				}
			}
		}
		xhr.onerror = function (e) {
			console.error(xhr.statusText);
		};
		xhr.send(null);
	}
	
	function readDataString(dataString) {
		var dataTwoSlots = JSON.parse(dataString.replace(",,",","));
		var maps;
		var code;
		var i,j;
		if (typeof(dataTwoSlots)=="object") {
			for(var slot=0; slot<dataTwoSlots.length; slot++) { // that should be only 0 and 1, for now, for current and previous time slots
				data = dataTwoSlots[slot];
				maps = {};
				for(i in data) {
					code = false;
					if(data[i]["band"]) {
						if(bandShortcuts[data[i]["band"]]) {
							code = bandShortcuts[data[i]["band"]] + data[i]["dots"];
						}
					}
					if(data[i]["dots"] == "0") {
						code = "empty";
					}
					if(code) {
						if(!maps[data[i]["name"]]) {
							maps[data[i]["name"]] = {};
						}
						maps[data[i]["name"]][code] = {"num_reports": data[i]["reports_on_710"], "report": data[i]["last_report_text"]};
					}
				}
				allMapData[slot] = maps;
			}
		}
	}
	
	function applyData(data) {
		var most_reports;
		var code, report, i;
		var mapDivs = document.getElementsByClassName("map_container");
		for(i=0; i<mapDivs.length; i++) {
			mapDivs[i].firstChild.firstChild.className = "map_unknown";
			document.getElementById("report_" + mapDivs[i].id.substring(7)).innerHTML = "";
		}
		for(i in data) {
			most_reports = -1;
			for(j in data[i]) {
				if(data[i][j]["num_reports"] > most_reports) {
					most_reports = data[i][j]["num_reports"];
					code = j;
					report = data[i][j]["report"];
				}
			}
			setMapDots(i,code,report);
		}
	}
	function applyDataString(dataString) {
		readDataString(dataString);
		applyData(allMapData[currentSlot]);
	}
	
	function switchSlot() {
		currentSlot = 1-currentSlot;
		if(currentSlot == 0) {
			document.getElementById("switch_slot").innerHTML = "Currently shown: Current activity.";
		} else {
			document.getElementById("switch_slot").innerHTML = "Currently shown: Activity from last reset."; 
		}
		applyData(allMapData[currentSlot]);
		if(currentSlot == 1 && firstTimeSwitch) {
			firstTimeSwitch = false;
			alert("You are now viewing data from the PREVIOUS reset. Click again to switch back to current data.");
		}
	}
		
	// ---------------------------------------------------------------
	// Create tooltips
	function createTooltips() {
		var mapDivs = document.getElementsByClassName("map_container");
		var tooltip, name, tooltipDiv, reportDiv;
		for(var i=0; i<mapDivs.length; i++) {
			name = mapDivs[i].id.substring(7);
			tooltip = mapDivs[i].firstChild;
			tooltipDiv = document.createElement("div");
			tooltipDiv.innerHTML = name.replace(/_/g, " ");
			tooltipDiv.className = "tooltipDiv";
			reportDiv = document.createElement("div");
			reportDiv.id = "report_" + name;
			reportDiv.className = "report";
			tooltipDiv.appendChild(reportDiv);
			tooltip.appendChild(tooltipDiv);
		}
	}
	
	// ---------------------------------------------------------------
	// Start timer
	function startTimer(duration, display) {
		var timer = duration, minutes, seconds;
		window.beforeDataUpdate = numTimerUpdatesBetweenDataUpdates;
		function updateTimer() {
			if(--window.beforeDataUpdate <= 0) {
				window.beforeDataUpdate = numTimerUpdatesBetweenDataUpdates;
				loadData(applyDataString);
			}
			var remaining = Math.floor((60 - (new Date()).getMinutes() + reset) % 60);
			
			if(remaining < 2 || remaining > 58) {
				display.textContent = "Reset just happened or is about to happen."
			} else {
				display.textContent = remaining + " minutes before reset.";
			}
		}
		updateTimer();
		setInterval(updateTimer, 1000*updateTimerInterval);
	}
	
	// ---------------------------------------------------------------
	// Main function
    function onLoad() {
		createTooltips();
		switchSlot();
		drawAllArrows();
		loadData(applyDataString);
		
		startTimer(600, document.getElementById("timer"));
    }