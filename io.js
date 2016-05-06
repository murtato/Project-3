var io = require('socket.io')();

io.on('connection', function (socket) {
  console.log('Client connected to socket.io!');

  // socket.on("gameOver", function(res){
  //   io.emit("gameOver", {event: "gameOver", msg: "Game Over!"})
  // })

});

module.exports = io;
