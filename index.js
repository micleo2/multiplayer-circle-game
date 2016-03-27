var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var statId = 3;
var clientPlayers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log("New client registered");
  /*socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log("Broadcasting message to all observers");
  });*/
  socket.on("newplayer", function(plyr){
	  console.log("Player added to pool");
	  plyr.id = statId++;
	  socket.broadcast.emit("newplayer", plyr);
  });
  
  socket.on("playerUpdate", function(obj){
	  socket.broadcast.emit("playerUpdate", obj);
  });
  
  socket.on('disconnect', function () {
	  console.log("Client unregistered");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
