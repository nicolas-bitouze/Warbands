var app = angular.module('app', ['ui.bootstrap']);

app.controller('mainController', function($scope, $http, $log, $interval){
  
  // Initialize a list of all maps 
  $scope.initMaps = {
    68 : {"Crypt":{},"Desert":{},"Dunes":{},"Dungeon":{},"Grotto":{},"Pit":{},"Tropical_Island":{}},
    69 : {"Arcade":{},"Cemetery":{},"Channel":{},"Mountain_Ledge":{},"Sewer":{},"Thicket":{},"Wharf":{},"Maelstrom_of_Chaos":{},"Vaults_of_Atziri":{}},
    70 : {"Ghetto":{},"Mud_Geyser":{},"Museum":{},"Quarry":{},"Reef":{},"Spider_Lair":{},"Vaal_Pyramid":{},"The_Apex_of_Sacrifice":{},"Mao_Kun":{}},
    71 : {"Arena":{},"Overgrown_Shrine":{},"Promenade":{},"Shore":{},"Spider_Forest":{},"Tunnel":{},"Acton\'s_Nightmare":{}},
    72 : {"Bog":{},"Coves":{},"Graveyard":{},"Pier":{},"Underground_Sea":{},"Villa":{}},
    73 : {"Arachnid_Nest":{},"Catacomb":{},"Colonnade":{},"Dry_Woods":{},"Temple":{},"Strand":{},"Poorjoy\'s_Asylum":{},"Whakawairua_Tuahu":{}},
    74 : {"Jungle_Valley":{},"Labyrinth":{},"Mine":{},"Torture_Chamber":{},"Waste_Pool":{},"Oba\'s_Cursed_Trove":{}},
    75 : {"Canyon":{},"Cells":{},"Dark_Forest":{},"Dry_Peninsula":{},"Orchard":{}},
    76 : {"Arid_Lake":{},"Gorge":{},"Residence":{},"Underground_River":{}},
    77 : {"Bazaar":{},"Necropolis":{},"Plateau":{},"Volcano":{}},
    78 : {"Academy":{},"Crematorium":{},"Precinct":{},"Springs":{}},
    79 : {"Arsenal":{},"Overgrown_Ruin":{},"Shipyard":{},"Village_Ruin":{},"Vaal_Temple":{}},
    80 : {"Courtyard":{},"Excavation":{},"Wasteland":{},"Waterways":{},"The_Alluring_Abyss":{}},
    81 : {"Maze":{},"Palace":{},"Shrine":{},"Olmec\'s_Sanctum":{}},
    82 : {"Abyss":{},"Colosseum":{},"Core":{}}
  }
  
  {
    angular.forEach($scope.initMaps, function(maps,_) {
	  angular.forEach(maps, function(object, key){
	    object.name = key;
      });
	});
  }
  
  $scope.settings = {
    showDots : -1
  }
  
  $scope.search = '';
  
  function update(){
    $http.get('http://nembibi.com/warbands/current_data.json').success(function(data){
      $scope.maps = angular.copy($scope.initMaps);
      $scope.dots4 = [];
      // Iterate over each of the CURRENT warbands
      angular.forEach(data[0], function(object, key){
        // Parse the data into a new object, with the map name as key
        angular.forEach($scope.maps, function(maps, lv){
          // Only overwrite maps with data.
          if(maps.hasOwnProperty(object.name)){
            // Remove the timestamp in front of the message
            object.last_report_text = object.last_report_text.replace(/\[\d+\] /g, '');
            // Rewrite the # into an @, and remove the colon at the end
            object.last_report_name = object.last_report_text.match(/#.*:/)[0].replace(/#/,'@').replace(/:/,'');
            // remove everything that's not a part of the message
            object.last_report_text = object.last_report_text.replace(/#.*: /, '');
            $scope.maps[lv][object.name] = object;
            // Parse the 4dot maps to use in the sidepanel

            if(object.dots == "4") $scope.dots4.push(object.name);
          }
        })

      })
    });
  }
  $http.get('http://nembibi.com/warbands/reset_timer').success(function(data){
    $scope.resetTime = data;
    timer();
  });
  function timer(){
    var d = new Date();
    addHour = new Date().getMinutes() > $scope.resetTime ? 1 : 0
    d.setHours(new Date().getHours() + addHour);
    d.setMinutes($scope.resetTime);
    d.setSeconds(0);
    t = new Date().getTime();
    
    tt = Math.ceil((d.getTime() - t) / 60000);
    
    var plural = tt!=1 ? 's' : '';
    $scope.timeToReset = tt + ' minute' + plural;
  }
  
  update();
  
  
  $interval(function(){ update() }, 10000);
  $interval(function(){ timer() }, 1000)
  $scope.mapPopover = {
    templateUrl : 'mapPopover.html'
  }
  
  $scope.bandLoot = function(band){
    switch(band){
      case 'Brinerot':
          return 'Gloves';
          break;
      case 'Redblade':
          return 'Helmets';
          break;
      case 'Mutewind':
          return 'Boots';
          break;
    }
  }
  
  $scope.searchMaps = function(mapName, search){
    var re = new RegExp(search, "gi");
    if(search == '') return true;
    if(re.test(mapName)) return true;
    console.log(mapName);
    return false;
  }
  
  $scope.showMaps = function(map, dots){
    if($scope.search){
      var s = $scope.search.replace(/\ /g, '_');
      re = new RegExp(s, "i");
      return re.test(map.name);
    } else {
      if(dots == -1) return true; // Show all
      if(map.dots == 4 && dots == 4) return true; // Show 4d only
      if(dots == 0 && !map.dots) return true; // Show unknown only
    }
  }
  
  $scope.showRows = function(level) {
    var rowIsEmpty = true;
    angular.forEach($scope.maps[level], function(map, _){
	  if(!rowIsEmpty) return;
	  if($scope.showMaps(map, $scope.settings.showDots)) rowIsEmpty = false;
	});
	return !rowIsEmpty;
  }
  
  $scope.rowIsOdd = function(level) {
    var isOdd = true;
    angular.forEach($scope.maps, function(maps, lv){
      if(lv < level && $scope.showRows(lv)) isOdd = !isOdd;
    });
    if(isOdd) return "odd";
  }
  
  
  
  
// End controller  
});

// Unique maps has apostrophe's (') which is not allowed in urls, and has to be replaced with '%27'
app.filter('fixQuote', function(){
  return function(input){
    return input.replace(/\'/g, '%27');
  }
});

// Maps with spaces has been rewritten to underscores (_) this will revert it, so that the user sees something pretty <3
app.filter('fixName', function(){
  return function(input){
    return input.replace(/\_/g, ' ');
  }
});

app.filter('pluralize', function(){
  return function(input, word){
    var r = input + ' ' + word;
    return input == 1 ? r : r+'s';
  }
})