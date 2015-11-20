var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Drone = require('rolling-spider');
var ACTIVE = true;
var STEPS = 5;

var choppah = new Drone(process.env.UUID);
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(app.get('port'), function () {
  console.log('server listening on ' + app.get('port'));
})

io.on('connection', function (socket) {

  socket.on('choppah:launch', function (data) {
    console.log('takeoff!', data.msg);
    launch();
  });
  socket.on('choppah:land', function () {
    console.log('landing!!');
    choppah.land();
    setTimeout(function () {
    process.exit();
    }, 3000);
  });
  socket.on('choppah:left', function () {
    console.log('going left');
    choppah.turnLeft({ steps: 20 });
    cooldown();
  });
  socket.on('choppah:right', function () {
    console.log('going right');
    choppah.turnRight({ steps: 20 });
    cooldown();
  });
  socket.on('choppah:forward', function () {
    console.log('going forward');
    choppah.forward({ steps: 20 });
    cooldown();
  });
  socket.on('choppah:backward', function () {
    console.log('going backward');
    choppah.backward({ steps: 20 });
         cooldown();
  });
  socket.on('choppah:flip', function () {
    console.log('flippin awesome!');
    choppah.frontFlip({ steps: STEPS });
          cooldown();
  });
  socket.on('choppah:down', function () {
    console.log('down down');
    choppah.down({ steps: STEPS * 2.5 });
    cooldown();
  })
  socket.on('choppah:up', function () {
    console.log('up up');
    choppah.up({ steps: STEPS * 2.5 });
    cooldown();
  })
  socket.on('choppah:shit', function () {
          choppah.emergency();
          setTimeout(function () {
            process.exit();
          }, 3000);
  })

});




function cooldown() {
  ACTIVE = false;
  setTimeout(function () {
    ACTIVE = true;
  }, STEPS * 12);
}



function launch() {
  choppah.connect(function () {
    choppah.setup(function () {
      console.log('Prepare for take off! ', choppah.name);
      choppah.flatTrim();
      choppah.startPing();
      choppah.flatTrim();

      choppah.on('battery', function () {
        console.log('Battery: ' + choppah.status.battery + '%');
        choppah.signalStrength(function (err, val) {
          console.log('Signal: ' + val + 'dBm');
        });

      });
      setTimeout(function () {
        choppah.takeOff();
        ACTIVE = true;
      }, 1000);

    });
  });

}
