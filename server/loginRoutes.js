var passport = require('passport');
var User = require('./User');
var Game = require("./Game");

module.exports = function (app) {
    
    app.get('/', function (req, res) {
        if (req.user === undefined){
            res.sendfile('html/login.html');
        }
        else {
			if(req.query.id === undefined)
				res.sendfile('html/chooseGame.html');
			else
			{
				res.cookie("id", req.query.id);
				res.cookie("user", req.user.username);
				res.sendfile("html/gameBoard.html");
			}
        }
    });

    app.post('/register', function(req, res) {
        var username = req.body.username;
        
        User.findOne({username : username }, function(err, existingUser) {
            if (err){
                return res.send({'err': err});
            }
            if (existingUser) {
                return res.send('user exists');
            }

            var user = new User({ username : req.body.username });
            user.registeredTimestamp = new Date();
            user.setPassword(req.body.password, function(err) {
                if (err) {
                    return res.send({'err': err});
                }

                user.save(function(err) {
                    if (err) {
                        return res.send({'err': err});
                    }
                    return res.send('success');
                });
            });  
        });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        req.user.lastUserAgent = req.headers['user-agent'];
        req.user.lastIp = req.ip;
        req.user.lastHost = req.host;
        req.user.lastLoginTimestamp = new Date();
        req.user.save();
        return res.send('success');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
