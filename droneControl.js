module.exports = (function () {
  'use strict';
  var ACTIVE = true;
  var STEPS = 5;
  var commands = {
    left: function (drone) {
      console.log('going left');
      drone.turnLeft({ steps: 20 });
      this.cooldown();
    },
    right: function (drone) {
      console.log('going right');
      drone.turnRight({ steps: 20 });
      this.cooldown();
    },
    up: function (drone) {
      console.log('up up');
      drone.up({ steps: STEPS * 2.5 });
      this.cooldown();

    },
    down: function (drone) {
      console.log('down down');
      drone.down({ steps: STEPS * 2.5 });
      this.cooldown();
    },
    forward: function (drone) {
      console.log('going forward');
      drone.forward({ steps: 20 });
      this.cooldown();
    },
    backward: function (drone) {
      console.log('going backward');
      drone.backward({ steps: 20 });
      this.cooldown();
    },
    flip: function (drone) {
      console.log('flippin awesome!');
      drone.frontFlip({ steps: STEPS });
      this.cooldown();
    },
    launch: function (drone) {
      drone.connect(function () {
        drone.setup(function () {
          console.log('Prepare for take off! ', drone.name);
          drone.flatTrim();
          drone.startPing();
          drone.flatTrim();

          drone.on('battery', function () {
            console.log('Battery: ' + drone.status.battery + '%');
            drone.signalStrength(function (err, val) {
              console.log('Signal: ' + val + 'dBm');
            });

          });
          setTimeout(function () {
            drone.takeOff();
            ACTIVE = true;
          }, 1000);

        });
      });

    },
    land: function (drone) {
      console.log('landing!!');
      drone.land();
      setTimeout(function () {
      process.exit();
      }, 3000);
    },
    cooldown: function () {
      ACTIVE = false;
      setTimeout(function () {
        ACTIVE = true;
      }, STEPS * 12);
    },
    shit: function (drone) {
      drone.emergency();
      setTimeout(function () {
        process.exit();
      }, 3000);
    }
  };
  return function(droneInstance, action) {
    return commands[action](droneInstance)
  };

})();
