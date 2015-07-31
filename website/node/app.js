var app = require('express.io')();
var fs = require('fs');
var express = require('express');

app.http().io();

app.use(express.static(__dirname + '/public'));

app.io.route('init', function(req){
  var jsonObj = fs.readFileSync(__dirname + '/current_data.json', 'utf8');
  req.io.respond({
    success : jsonObj
  })
});

app.io.route('loadLegacy', function(req){
  fs.stat(__dirname + '/legacy/data_' + req.data + '.json', function(err, stat){
    if(err==null){
      var jsonObj = fs.readFileSync(__dirname + '/legacy/data_' + req.data + '.json', 'utf8');
      req.io.respond({
        success : jsonObj
      })
    } else {
      console.log(err.code);
    }
  });
});

fs.watchFile(__dirname + '/current_data.json', function (event, filename) {
  console.log('Updated!');
  app.io.broadcast('update', fs.readFileSync(__dirname + '/current_data.json', 'utf8'));
});

// Start the server
app.listen(3700);
console.log('server started');
// Routes
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});