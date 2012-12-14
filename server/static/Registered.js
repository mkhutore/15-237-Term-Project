var App = function(){
    $('#logout').onButtonTap(function(){
        window.location = '/logout';   
    });

    $('#newGame').onButtonTap(this.requestGame.bind(this));

	this.table = $("#gameTable");
	this.socket = io.connect('http://localhost:3000/');
	
	this.setUser();
	this.update();
	
	this.socket.on("newGame", function(data){
		if(data.game.player1 === this.user || data.game.player2 === this.user)
		{
			$("#newGame").removeAttr("disabled");
			this.update();
		}
	}.bind(this));
}

App.prototype.setUser = function(){
    var req = $.ajax({
        url: '/user',
        type: 'POST',
        data: {}});
    req.done(function(user){
		this.user = user;
	}.bind(this));
}

App.prototype.requestGame = function(){
	$("#newGame").attr("disabled", "disabled");

	var newGame = $("<tr>");
	newGame.append($("<td>Waiting...</td>"));
	newGame.append($("<td></td>"));
	var button = $("<button>");
	button.attr("disabled", "disabled");
	button.text("Start");
	newGame.append($("<td>").append(button));
	
	this.table.append(newGame);

    this.socket.emit("requestGame", {"user": this.user});
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
	console.log(games);
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
	
	if(game.lastPlayedTimestamp === undefined)
		lp.text("");
	else
	{
		var date = new Date(game.lastPlayedTimestamp);
		lp.text(date.toDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
	}
	
	var start = $("<td>");
	var button = $("<button>");
	button.text("Start");
	button.onButtonTap(function(){
		this.startGame(game._id)
	}.bind(this));
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

App.prototype.startGame = function(id){
	window.location = "/?id=" + id;
}
