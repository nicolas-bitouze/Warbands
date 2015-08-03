var app = angular.module('app', ['ui.bootstrap','btford.socket-io']);  //,'panhandler'

app.controller('mainController', function($scope, $http, $log, $interval, $timeout, sockets){
  
  // Initialize a list of all maps 
  $scope.initMaps = {
    68 : {
      "Crypt":{left:0,top:650,bg_pos:1055,cards:{}},
      "Desert":{left:0,top:780,bg_pos:1155, cards:{Hope:{rewards:'Prismatic Ring', corrupted:true, color:'#af6025'}}},
      "Dunes":{left:0,top:260,bg_pos:1305,cards:{}},
      "Dungeon":{left:0,top:0,bg_pos:1355,cards:{
                    The_Summoner:{
                      rewards:'Superior Minion Gem',
                      corrupted:false,
                      color:'#1ba29b'
                    }
                  }
                },
      "Grotto":{left:0,top:130,bg_pos:1605,cards:{}},
      "Pit":{left:0,top:390,bg_pos:2505,cards:{}},
      "Tropical_Island":{left:0,top:520,bg_pos:3555,cards:{}}
    },
    69 : {
      "Arcade":{left:130,top:520,bg_pos:205,cards:{
                    The_Summoner:{
                      rewards:'Superior Minion Gem',
                      corrupted:false,
                      color:'#1ba29b'
                    }
                  }
                },
      "Cemetery":{left:130,top:390,bg_pos:655,cards:{}},
      "Channel":{left:130,top:0,bg_pos:705,cards:{}},
      "Mountain_Ledge":{left:130,top:260,bg_pos:1955,cards:{}},
      "Sewer":{left:130,top:650,bg_pos:2905,cards:{}},
      "Thicket":{left:130,top:130,bg_pos:3455,cards:{}},
      "Wharf":{left:130,top:780,bg_pos:4255,cards:{}},
      "Maelstrom_of_Chaos":{left:153,top:315,bg_pos:1755,cards:{}},
      "Vaults_of_Atziri":{left:283,top:185,bg_pos:3855,cards:{}}
    },
    70 : {
      "Ghetto":{left:260,top:650,bg_pos:1455,cards:{}},
      "Mud_Geyser":{left:260,top:520,bg_pos:2005,cards:{}},
      "Museum":{left:260,top:780,bg_pos:2055,cards:{}},
      "Quarry":{left:260,top:390,bg_pos:2755,cards:{}},
      "Reef":{left:260,top:260,bg_pos:2805,cards:{}},
      "Spider_Lair":{left:260,top:0,bg_pos:3155,cards:{}},
      "Vaal_Pyramid":{left:260,top:130,bg_pos:3755,cards:{}},
      "The_Apex_of_Sacrifice":{left:220,top:75,bg_pos:3405,cards:{}},
      "Mao_Kun":{left:283,top:315,bg_pos:1805,cards:{}}
    },
    71 : {
      "Arena":{left:390,top:715,bg_pos:255,cards:{}},
      "Overgrown_Shrine":{left:390,top:0,bg_pos:2355,cards:{}},
      "Promenade":{left:390,top:520,bg_pos:2705,cards:{}},
      "Shore":{left:390,top:260,bg_pos:3005,cards:{}},
      "Spider_Forest":{left:390,top:390,bg_pos:3105,cards:{}},
      "Tunnel":{left:390,top:130,bg_pos:3605,cards:{}},
      "Acton\'s_Nightmare":{left:413,top:55,bg_pos:105,cards:{}},
      "Phantasmagoria":{left:390,top:617,bg_pos:4305,cards:{}}
    },
    72 : {
      "Bog":{left:520,top:130,bg_pos:455,cards:{}},
      "Coves":{left:520,top:390,bg_pos:955,cards:{}},
      "Graveyard":{left:520,top:260,bg_pos:1555,cards:{}},
      "Pier":{left:520,top:0,bg_pos:2455,cards:{}},
      "Underground_Sea":{left:520,top:715,bg_pos:3705,cards:{}},
      "Villa":{left:520,top:520,bg_pos:3905,cards:{}}
    },
    73 : {
      "Arachnid_Nest":{left:650,top:0,bg_pos:155,cards:{}},
      "Catacomb":{left:650,top:520,bg_pos:555,cards:{}},
      "Colonnade":{left:650,top:390,bg_pos:755,cards:{}},
      "Dry_Woods":{left:650,top:260,bg_pos:1255,cards:{}},
      "Temple":{left:650,top:715,bg_pos:3305,cards:{}},
      "Strand":{left:650,top:130,bg_pos:3255,cards:{}},
      "Poorjoy\'s_Asylum":{left:673,top:770,bg_pos:2605,cards:{}},
      "Whakawairua_Tuahu":{left:673,top:185,bg_pos:4205,cards:{}},
      "Olmec\'s_Sanctum":{left:627,top:575,bg_pos:2205,cards:{}}
    },
    74 : {
      "Jungle_Valley":{left:780,top:260,bg_pos:1655,cards:{}},
      "Labyrinth":{left:780,top:390,bg_pos:1705,cards:{}},
      "Mine":{left:780,top:130,bg_pos:1905,cards:{}},
      "Torture_Chamber":{left:780,top:618,bg_pos:3505,cards:{}},
      "Waste_Pool":{left:780,top:0,bg_pos:4055,cards:{}},
      "Oba\'s_Cursed_Trove":{left:803,top:673,bg_pos:2155,cards:{}}
    },
    75 : {
      "Canyon":{left:910,top:0,bg_pos:505,cards:{}},
      "Cells":{left:910,top:618,bg_pos:605,cards:{}},
      "Dark_Forest":{left:910,top:130,bg_pos:1105,cards:{}},
      "Dry_Peninsula":{left:910,top:260,bg_pos:1205,cards:{}},
      "Orchard":{left:910,top:390,bg_pos:2255,cards:{}}
    },
    76 : {
      "Arid_Lake":{left:1040,top:0,bg_pos:305,cards:{}},
      "Gorge":{left:1040,top:130,bg_pos:1505,cards:{}},
      "Residence":{left:1040,top:260,bg_pos:2855,cards:{}},
      "Underground_River":{left:1040,top:504,bg_pos:3655,cards:{}},
      "Malformation":{left:1040,top:382,bg_pos:4355,cards:{}}
    },
    77 : {
      "Bazaar":{left:1170,top:130,bg_pos:405,cards:{}},
      "Necropolis":{left:1170,top:504,bg_pos:2105,cards:{}},
      "Plateau":{left:1170,top:0,bg_pos:2555,cards:{}},
      "Volcano":{left:1170,top:260,bg_pos:4005,cards:{}}
    },
    78 : {
      "Academy":{left:1300,top:130,bg_pos:55,cards:{}},
      "Crematorium":{left:1300,top:504,bg_pos:1005,cards:{}},
      "Precinct":{left:1300,top:0,bg_pos:2655,cards:{}},
      "Springs":{left:1300,top:260,bg_pos:3205,cards:{}}
    },
    79 : {
      "Arsenal":{left:1430,top:260,bg_pos:355,cards:{}},
      "Overgrown_Ruin":{left:1430,top:0,bg_pos:2305,cards:{}},
      "Shipyard":{left:1430,top:504,bg_pos:2955,cards:{}},
      "Village_Ruin":{left:1430,top:130,bg_pos:3955,cards:{}},
      "Vaal_Temple":{left:1797,top:437,bg_pos:3805,cards:{}}
         },
    80 : {
      "Courtyard":{left:1560,top:0,bg_pos:905,cards:{}},
      "Excavation":{left:1560,top:130,bg_pos:1405,cards:{}},
      "Wasteland":{left:1560,top:504,bg_pos:4105,cards:{}},
      "Waterways":{left:1560,top:260,bg_pos:4155,cards:{}},
      "The_Alluring_Abyss":{left:295,top:65,bg_pos:3355,cards:{}}
    },
    81 : {
      "Maze":{left:1690,top:130,bg_pos:1855,cards:{}},
      "Palace":{left:1690,top:382,bg_pos:2405,cards:{}},
      "Shrine":{left:1690,top:0,bg_pos:2355,cards:{}}
    },
    82 : {
      "Abyss":{left:1820,top:0,bg_pos:5,cards:{}},
      "Colosseum":{left:1820,top:130,bg_pos:805,cards:{}},
      "Core":{left:1820,top:382,bg_pos:855,cards:{}}
    }  
  };
  
  // Array of (map_name, map_data) key,value pairs, map_data has two integer valued fields: bg_pos and level
  $scope.mapsByName = {}
  
  {
    angular.forEach($scope.initMaps, function(maps,level) {
      angular.forEach(maps, function(object, key){
        object['level'] = level;
        $scope.mapsByName[key] = object;
        maps[key] = {'name':key};
      });
    });
    // We actually remove bg_pos from initMaps, since we don't need it there, and only put it in mapsByName.
    // Yeah, this is a bit convoluted, but it's probably the solution with the least amount of code that 
    // doesn't imply copying every bg_pos attribute every time we call update().
  }
  
  $scope.d4classSwitch = true;

  $scope.date = new Date().getTime();
  $scope.search = '';
  $scope.autoUpdate = true;
  $scope.timestampOffset = (new Date()).getTimezoneOffset() * 1000;
  
  $scope.firstLoad = true;
  var alreadyCalled = [];
  
  sockets.emit('init', function(data, ev){
    updateMaps(JSON.parse(data.success));
  })
  
  sockets.on('update', function (data, ev) {
    // Don't update the view if the user is watching legacy files
    if($scope.autoUpdate){
      updateMaps(JSON.parse(data));
    }
  });
    
  
  $scope.settings = {
    showDots: -1,
    forestLayout: true,
    toolboxWidth: 300,
    callOutDots: true,
    supportsSynth : 'speechSynthesis' in window
  }
  
  if(typeof(Storage) !== 'undefined') {
    $scope.settings.forestLayout = localStorage.getItem('forestLayout') === "true";
    //$scope.settings.callOutDots = localStorage.getItem('callOutDots') === "true";
  }  
  
  $scope.$watch("date", function(j,_){
    d = new Date(j);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    $scope.unix = d.getTime();
  })
  
  $scope.$watch('dateHour', function(j,_){
    if(j==$scope.getCurrentTimeslot()){
      $scope.autoUpdate = true;
      // update();
    } else {
      $scope.autoUpdate = false;
      $scope.getLegacy(j);
    }
  })
  
  // Draw the arrows in the forest layout
  $scope.arrows = [
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
    ["Desert", "Wharf", "Museum", "Arena"],
    ["Phantasmagoria","Underground_Sea"],
    ["Malformation","Necropolis"],
  ];
  $timeout(function(){drawAllArrows($scope.arrows)},0);
  
  
  function updateMaps(data){
    $scope.maps = angular.copy($scope.initMaps);
    $scope.dots4 = [];
    // Iterate over each of the CURRENT warbands
    angular.forEach(data['maps'], function(object, _){
      // Reset the already called out maps on warband reset
      if(data.timeslot>$scope.getCurrentTimeslot()) alreadyCalled = [];
      // Parse the data into a new object, with the map name as key
      angular.forEach($scope.maps, function(maps, lv){
        // Only overwrite maps with data.
        if(maps.hasOwnProperty(object.name)){
          // And only if it has more reports than whatever we had before
          // or that it has band info and that what was stored doesn't
          if(
            (maps[object.name].reports_on_710 == null) ||
            ((object.band != 'None') && (
              (maps[object.name].reports_on_710 < object.reports_on_710) || 
              (maps[object.name].band == 'None')
            ))
          ) {
            // Report's time string
            var matches = object.last_report_text.match(/\[(\d+)\]/);
            if(matches) {
              var date = new Date(parseInt(matches[1])*1000 + $scope.timestampOffset);
              object.last_report_time = (date.getHours()<10?"0":"") + date.getHours() + ":" + (date.getMinutes()<10?"0":"") + date.getMinutes();
            }
            // Remove the timestamp in front of the message
            object.last_report_text = object.last_report_text.replace(/\[\d+\] /g, '');
            // Rewrite the # into an @, and remove the colon at the end
            object.last_report_name = object.last_report_text.match(/#.*:/)[0].replace(/#/,'@').replace(/:/,'');
            // remove everything that's not a part of the message
            object.last_report_text = object.last_report_text.replace(/#.*: /, '');
            // Parse in div cards
            object.cards = $scope.maps[lv][object.name].cards;
            $scope.maps[lv][object.name] = object;
            // Parse the 4dot maps to use in the sidepanel
            if(object.dots == "4" && $scope.dots4[object.name] == undefined){
              if($scope.settings.callOutDots && $scope.firstLoad) alreadyCalled.push(object.name.replace(/_/g,' ').replace(/'/g, ''));
              $scope.dots4.push(object.name);
              // Don't speak if it's the first time we run through this
              if($scope.settings.callOutDots && !$scope.firstLoad && $scope.autoUpdate){
                // If the voices has been loaded, go ahead and speak
                if($scope.voiceIsLoaded){
                  callOutDots(object);
                }   
              }
            }
          }
        }
      })
    })
    $scope.d4classSwitch = !$scope.d4classSwitch;
    $scope.firstLoad = false;
  }
  
  $http.get('http://nembibi.com/warbands/reset_timer', {cache:true}).success(function(data){
    $scope.resetTime = data;
    timer();
  });
  
  $scope.getLegacy= function(timeslot){
    $scope.autoUpdate = false;
    sockets.emit('loadLegacy', timeslot, function(data, ev){
      updateMaps(JSON.parse(data.success));
    });
  }
  
  window.speechSynthesis.onvoiceschanged = function() {
    $scope.voiceIsLoaded = true;
  };
  
  function callOutDots(map){
    var map_name = map.name.replace(/_/g,' ').replace(/'/g, '')
    if ($scope.settings.supportsSynth && alreadyCalled.indexOf(map_name) === -1) {
      alreadyCalled.push(map_name);
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[1];
      
      switch(map.band){
        case 'Mutewind' :
          dots = 'Cleansed';break;
        case 'Brinerot' :
          dots = 'Captured';break;
        case 'Redblade' :
          dots = 'Conquerred';break;
      }
      
      msg.text = map_name + ' has been ' + dots + ' by ' + map.band;
      msg.lang = 'en-US';
      speechSynthesis.speak(msg);
    }
  }
  
  function timer(){
    // User is viewing live data
    if($scope.autoUpdate){
      $scope.date = $scope.getCurrentTime();
      $scope.dateHour = $scope.getCurrentTimeslot();
    }
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
  
  $scope.getCurrentTimeslot = function(){
    return Math.floor(new Date().getTime() / 3600000);
  }
  $scope.getCurrentTime = function(){
    return new Date();
  }
  
  $scope.toggleLayout = function() {
    $scope.settings.forestLayout = !$scope.settings.forestLayout;
    if(typeof(Storage) !== 'undefined') {
      localStorage.setItem('forestLayout', $scope.settings.forestLayout);
    }
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

app.filter('makeRange', function() {
  return function(input) {
    var lowBound, highBound;
    switch (input.length) {
    case 1:
      lowBound = 0;
      highBound = parseInt(input[0]) - 1;
      break;
    case 2:
      lowBound = parseInt(input[0]);
      highBound = parseInt(input[1]);
      break;
    default:
      return input;
    }
    var result = [];
    for (var i = lowBound; i <= highBound; i++)
      result.push(i);
    return result;
  };
});

app.filter('toTimeslot', function(){
  return function(input){
    return Math.floor(input/3600000);
  }
})

app.filter('betweenParentheses', function() {
  return function(input) {
    if(input && input != '') {
	  return '(' + input + ')';
	} else {
	  return '';
	}
  }
})

app.factory('sockets', function (socketFactory) {
   return socketFactory();
});