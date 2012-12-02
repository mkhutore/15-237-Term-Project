/*two main categories of ships, deployed ships and main ships;
this covers the basics of both */

var Ship = function(config){
	SpaceJect.call(this, config);
	if (config !== undefined){
	this.shipName = config.shipName;
	this.faction = config.faction;
	this.shipClass = config.shipClass;
	this.maxHP = config.HP; //health points
	this.HPMod = config.HPMod; //modifiers
	this.currentHP = config.HP * this.HPMod; //modifiers affect spawned attributes
	this.player = config.player;
	this.atkList = config.atkList; //attack list, attacks are objects (not SpaceJects though!)
	this.SDStr = config.SDStr;
	this.maxSDCapac = config.SDCapac; //shield, capacity
	this.SDMod = config.SDMod;
	this.currentSDCapac = config.SDCapac * this.SDMod;
	this.SDRegen = config.SDRegen; //shield regeneration
	this.offenseMods = config.offenseMods;
	this.defenseMods = config.defenseMods;
	this.speed = config.speed; //max amount of squares to move per turn
	this.moved = 0;
	this.CMAA = config.CMAA //can move after attack, boolean
	this.imgurl = config.imgurl;
}
}

	Ship.prototype = new SpaceJect();
	Ship.prototype.constructor = Ship;