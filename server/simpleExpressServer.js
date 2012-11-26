// simpleExpressServer.js
// A simple Express server for 15-237.

var fs = require("fs");
var path = require("path");
var express = require("express");
var flash = require("connect-flash");

var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;

var io = require('socket.io').listen(3000);

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
    app.use(flash());
    app.use(app.router);
});

function processJSONCMD(request, response){
    var cmd = request.params.cmd;
    var args = request.query;
    response.header("Cache-control", "no-cache");
    cmdHandler(cmd, request.user, args, response);
}

//all so post + get
app.all('/json/:cmd', processJSONCMD);

function serveStaticFile(request, response) {
    //notify the user they're logged in. Necessary because
    //  we use the same html for logging in and when they're
    //  logged in
    if (request.user !== undefined){
        response.cookie("user", request.user.id);
    }
    else {
        response.cookie("user", "none");
    }
    console.log("user:", request.user);
    response.sendfile("static/" + request.params.staticFilename);
}

function serveImageFile(request, response) {
    //notify the user they're logged in. Necessary because
    //  we use the same html for logging in and when they're
    //  logged in
    if (request.user !== undefined){
        response.cookie("user", request.user.id);
    }
    else {
        response.cookie("user", "none");
    }
    console.log("user:", request.user);
    response.sendfile("static/images/" + request.params.imageFilename);
}

app.get("/static/:staticFilename", serveStaticFile);
app.get("/static/images/:imageFilename", serveImageFile);

app.listen(8889);

process.on("uncaughtException", onUncaughtException);

//======================================
//      passport
//======================================

app.get("/success", function(request, response){
	if(request.user === "player1") response.sendfile("static/player1.html");
	else if(request.user === "player2") response.sendfile("static/player2.html");
});		
					   
app.post('/login',
  passport.authenticate('local', { successRedirect: '/static/gameBoard.html',
                                   failureRedirect: '/static/login.html',
                                   failureFlash: true }));

								   
//registering new users would be done by adding to these data structures
var idToUser = [
    { id: 0, username: 'player1', password: 'secret', email: 'player1@example.com' },
	{ id: 1, username: 'player2', password: 'secret', email: 'player2@example.com' }
];
var usernameToId = { 'player1': 0, 'player2': 1 };

passport.use(new PassportLocalStrategy(
    function(username, password, done) {
        var user = idToUser[usernameToId[username]];
        if (user === undefined)
            return done(null, false, { message: 'Unknown user ' + username });
        if (user.password !== password)
            return done(null, false, { message: 'Invalid password' });
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, idToUser[id]);
});

//======================================
//      general util
//======================================

function strEndsWith(str, end){
    return str.substr(-end.length) === end;
}

function sendObjectAsJSON(response, object){
    response.write(JSON.stringify(object));
    response.end();
}

//======================================
//      handling uncaught exceptions
//======================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    console.log(err);
}

//======================================
//      cmd handler
//======================================

function cmdHandler(cmd, user, args, response){
    function onCmdSuccess(result){
        sendObjectAsJSON(response, {'result':result});
    }

    function onCmdError(error){
        sendObjectAsJSON(response, { "err":error });
    }

    cmdHandlers[cmd](args, user, onCmdSuccess, onCmdError);
}


//======================================
//      cmd handler functions
//======================================

var cmdHandlers = { };

cmdHandlers.echo = function(args, user, onSuccess, onError) {
    var result = "Echo heard: <" + args.msg + ">";
    onSuccess(result);
}

cmdHandlers.sum = function(args, user, onSuccess, onError) {
    var x = Number(args.x);
    var y = Number(args.y);
    var result = x+y;
    onSuccess(result);
}

cmdHandlers.setMsg = function(args, user, onSuccess, onError) {
    // save args.msg to the file "msg.txt"
    function onComplete(err) {
        if (err) {
            onError(err);
        }
        else {
            var result = "ok";
            onSuccess(result);
        }
    };
    if (user === undefined){
        onError('not authorized!');
    }
    else {
        fs.writeFile(__dirname + "/msg.txt", args.msg, onComplete);
    }
}

cmdHandlers.getMsg = function(args, user, onSuccess, onError) {
    // load args.msg from the file "msg.txt"
    function onComplete(err, data) {
        if (err) {
            onError(err);
        }
        else {
            var result = data.toString();
            onSuccess(result);
        }
    };
    fs.readFile(__dirname + "/msg.txt", onComplete);
}

