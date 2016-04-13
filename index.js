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
	  for (var n = 0; n < clientPlayers.length; n++){
			if (clientPlayers[n].id === socket.id){
				clientPlayers[n].x = obj.x;
				clientPlayers[n].y = obj.y;
				break;
			}
	  }
  });

  socket.on('disconnect', function () {
	  socket.broadcast.emit("removeplayer", socket.id);
	  for (var n = 0; n < clientPlayers.length; n++){
			if (clientPlayers[n].id === socket.id){
				clientPlayers.splice(n, 1);
				break;
			}
		}
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
});
