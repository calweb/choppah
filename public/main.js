var socket = require('socket.io-client')('http://localhost:3000');

var commands = {
    'get to the choppa': function (data) {
      socket.emit('choppah:launch', {msg: "get to da choppa!"});
    },
    'go *action': function (action) {
      console.log("action: ", action);
      socket.emit('choppah:' + action, {msg: action});
    }
  };

  annyang.addCommands(commands);
  annyang.start();
