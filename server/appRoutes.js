var User = require('./User');
var Game = require("./Game");

module.exports = function (app) {

    app.post('/db/games', function(req, res){
        if (!req.user){
            res.status(401);
        }
        else {
            Game.find({$or: [{"player1" : req.user.username}, {"player2" : req.user.username}]}, 'player1 player2 lastPlayedTimestamp', 
                {sort:[['lastPlayedTimestamp',-1]]},
				function(err, games){
                    if (err)
                        res.send(err);
                    else
                        res.send(games);
            });
        }
    });
	
	app.post('/db/game', function(req, res){
        if (!req.user){
            res.status(401);
        }
        else {
            Game.findOne({"_id" : req.body.id}, 'player1 player2 objects', 
                function(err, game){
                    if (err)
                        res.send(err);
                    else if(game)
					{
						game.lastPlayedTimestamp = new Date();
						game.save(function(err){
							console.log("saving");
						    if (err) {
								return res.send({'err': err});
							}
							res.send(game);
						});
					}
            });
        }
    });

    app.post('/db/me/setMsg', function(req, res){
        req.user.msg = req.body.msg;
        req.user.lastMsgTimestamp = new Date();
        req.user.save();
        res.send();
    });
	
	app.post("/user", function(req, res){
		res.send(req.user.username);
	});
}
