//attack info

var Attack = function(config){
	console.log(config);
	this.atkName = config.atkName;
	this.atkPower = config.atkPower;
	this.atkBPower = config.atkBPower;
	this.atkStatuses = config.atkStatuses;
	this.atkElements = config.atkElements;
	this.atkRange = config.atkRange;
}