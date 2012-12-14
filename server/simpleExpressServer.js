// simpleExpressServer.js
// A simple Express server for 15-237.

var fs = require("fs");
var path = require("path");
var express = require("express");
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Game = require("./Game");

var io = require('socket.io').listen(3000);

//======================================
//      update IP
//======================================

/* var options = {
  host: 'freedns.afraid.org',
  path: '/dynamic/update.php?VU1vQ2ZhMzFVMVVBQUt1MVE0VUFBQUFGOjg3NTYyMDE='
};

http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
}).on('error', function(e) {
  console.log('ERROR: ' + e.message);
}); */

//======================================
//      sockets
//======================================

// list of game requests
var requests = [];
var maxid = 0;

// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
io.sockets.on('connection', function(socket){
	// Listen for this client's "send" event
	// remember, socket.* is for this particular client
	socket.on('send', function(data) {
		// Since io.sockets.* is the *all clients* socket,
		// this is a broadcast message.

		// Broadcast a "receive" event with the data received from "send"
		io.sockets.emit('receive', data);
	});
	
	socket.on("requestGame", function(data) {
		if(data.user != "none" && requests.lastIndexOf(data.user) == -1) requests.push(data.user);
		console.log(requests);
		if(requests.length >= 2) {
			console.log("Make new game");
			var p1 = requests.pop();
			var p2 = requests.pop();
			var game = new Game({"player1": p1, "player2": p2});
			game.startedTimestamp = new Date();
			game.save();
			io.sockets.emit("newGame", {"game": game});
		}
	});
	
	socket.on("startGame", function(data) {
		Game.findOne({"_id": data.game}, function(err, game) {
			console.log(game);
			io.sockets.emit("setupGame", {"game": game});
		});
	});
	
	socket.on("turnEnd", function(data) {
		io.sockets.emit("newTurn", data);
	})
});

//======================================
//      init/main
//======================================

var app = express();

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'change me!' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
	app.use(express.static(path.join(__dirname, 'static')));
});

var User = initPassportUser();

mongoose.connect('mongodb://localhost/myApp');

require('./loginRoutes')(app);
require('./appRoutes')(app);

function initPassportUser(){
    var User = require('./User');

    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    return User;
}

app.listen(8889);

process.on("uncaughtException", onUncaughtException);

//======================================
//      handling uncaught exceptions
//======================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    console.log(err);
}
