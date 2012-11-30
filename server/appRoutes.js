var User = require('./User');
var Game = require("./Game");

module.exports = function (app) {

    app.post('/db/root/users', function(req, res){
        if (!(req.user && req.user.superuser)){
            res.status(401);
        }
        else {
            User.find({}, 'username superuser msg registeredTimestamp lastLoginTimestamp ' +
                           'lastIp lastHost lastUserAgent lastMsgTimestamp', 
                function(err, users){
                    if (err)
                        res.send(err);
                    else
                        res.send(users);
            });
        }
    });

    app.post('/db/games', function(req, res){
        if (!req.user){
            res.status(401);
        }
        else {
            Game.find({$or: [{"player1" : req.user.username}, {"player1" : req.user.username}]}, 'player1 player2', 
                function(err, games){
                    if (err)
                        res.send(err);
                    else
                        res.send(games);
            });
        }
    });

    app.post('/db/me/setMsg', function(req, res){
        req.user.msg = req.body.msg;
        req.user.lastMsgTimestamp = new Date();
        req.user.save();
        res.send();
    });
	
	app.post("/db/user", function(req, res){
		res.send(req.user.username);
	});
}
