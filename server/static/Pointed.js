//to handle selected events (whether by tap or by click, we use this to shift
//the game

var Pointed = function(config){
	this.x = config.x; //where the 
	this.y = config.y;
	this.handled = config.handled;
}