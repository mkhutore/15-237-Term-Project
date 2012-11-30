var App = function(){
    $('#logout').onButtonTap(function(){
        window.location = '/logout';   
    });

    $('#newGame').onButtonTap(this.requestGame.bind(this));
	$('#setMsg').onButtonTap(this.setMsg.bind(this));
    $('#update').onButtonTap(this.update.bind(this));

    this.msgsDiv = $('#msgs');
	this.table = $("#gameTable");
	this.socket = io.connect('http://localhost:3000/');
	
	this.setUser();
	
	this.update();
	
	this.socket.on("newGame", function(data){
		if(data.game.player1 === this.user || data.game.player2 === this.user) this.update();
	}.bind(this));
}

App.prototype.setUser = function(){
    var req = $.ajax({
        url: '/db/user',
        type: 'POST',
        data: {}});
    req.done(function(user){
		this.user = user;
	}.bind(this));
}

App.prototype.requestGame = function(){
    var req = $.ajax({
        url: '/db/user',
        type: 'POST',
        data: {}});
    req.done(this.sendRequest.bind(this));
}

App.prototype.sendRequest = function(user){
	this.socket.emit("requestGame", {"user": user});
}

App.prototype.setMsg = function(){
    var msg = $('#msg').val();
    var req = $.ajax({
        url: '/db/me/setMsg',
        type: 'POST',
        data: {'msg': msg}
    });
    req.done(this.update.bind(this));
}

App.prototype.update = function(){
    var req = $.ajax({
        url: '/db/games',
        type: 'POST',
        data: {}});
    req.done(this.setGames.bind(this));

    req.fail(function(jqXHR, status, err){
        alert(err);
    });
}

App.prototype.setGames = function(games){
    this.table.children().remove();
    var header = $('<tr>');
    header.html("<td><h3>Opponent</h3></td><td><h3>Last Played</h3></td>");
    this.table.append(header);
    for (var i = 0; i < games.length; i++){
        this.appendGame(games[i]);
    }
}

App.prototype.appendGame = function(game){
    var row = $('<tr>');
	var lp = $("<td>");
	lp.text(game.lastPlayedTimestamp);
	
	var start = $("<td>");
	var button = $("<button>");
	button.text("Start");
	start.append(button);
	
	var opp = $("<td>");
    if (game.player1 === this.user){
		opp.text(game.player2);
    }
	else if(game.player2 === this.user){
		opp.text(game.player1);
    }
	
	row.append(opp);
	row.append(lp);
	row.append(button);
	
    this.table.append(row);
}
