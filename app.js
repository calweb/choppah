var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Drone = require('rolling-spider');
var d = require('./droneControl');
var ACTIVE = true;
var STEPS = 5;

var choppah = new Drone(process.env.UUID);
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
});


server.listen(app.get('port'), function () {
  console.log('server listening on ' + app.get('port'));
})

io.on('connection', function (socket) {
  socket.on('choppah', function (data) {
    console.log('choppha!', data.action);
    d(choppah, data.action);
  });
  socket.on('choppah:launch', function () {
    d(choppah, 'launch')
  })
});
