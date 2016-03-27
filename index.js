var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var statId = 3;
var clientPlayers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log("New client registered, ");
  console.log(socket.id);
  socket.emit("generateid", socket.id);
  socket.emit("catch-up", clientPlayers);
  socket.on("newplayer", function(plyr){
	  console.log("Player added to pool");
	  socket.broadcast.emit("newplayer", plyr);
	  clientPlayers.push(plyr);
  });
  socket.on("playerUpdate", function(obj){
	  socket.broadcast.emit("playerUpdate", obj);
  });
  
  socket.on('disconnect', function () {
	  socket.broadcast.emit("removeplayer", socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});