//captain ships are the ships that can deploy other ships, they can move and fire like other ships

var captainShip = function(config){
	Ship.call(this, config);

}

captainShip.prototype = new Ship();
captainShip.prototype.constructor = captainShip;