/*two main categories of ships, deployed ships and main ships;
this covers the basics of both */

var Ship = function(config){
	SpaceJect.call(this);
	this.shipName = config.shipName;
	this.maxHP = config.HP; //health points
	this.HPMod = config.HPMod; //modifiers
	this.currentHP = config.HP * this.HPMod; //modifiers affect spawned attributes
	this.allegiance = config.allegiance;
	this.player = config.player;
	this.atkList = config.atkList; //attack list, attacks are objects (not SpaceJects though!)
	this.maxSDCapac = config.SDCapac; //shield, capacity
	this.SDMod = config.SDMod;
	this.currentSDCapac = config.SDCapac * this.SDMod;
	this.SDRegen = config.SDRegen; //shield regeneration
	this.offenseMods = config.offenseMods;
	this.defenseMods = config.defenseMods;
}

Ship.prototype = new SpaceJect();
Ship.prototype.constructor = Ship;