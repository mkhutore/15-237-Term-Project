//captain ships are the ships that can deploy other ships, they can move and fire like other ships

var captainShip = function(config){
	Ship.call(this, config);
	this.energy = config.energy;
	this.energyRegen = config.energyRegen;
	this.deploys = config.deploys;
	this.deployRange = config.deployRange;
	this.toStatus = this.shipName;

}

captainShip.prototype = new Ship();
captainShip.prototype.constructor = captainShip;