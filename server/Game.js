var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    player1: String,
	player2: String,
    startedTimestamp: Date,
    lastPlayedTimestamp: Date
});

module.exports = mongoose.model('Game', Game);
