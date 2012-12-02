var TextHandler = function(){
}


TextHandler.prototype.readSingleFile = function(file) {
  $.get('asdf.txt', this.textGet.bind(this));
}

TextHandler.prototype.textGet = function(e) {
	this.gotText = e;
	this.lines = e.split('\n');
	this.show();
}

TextHandler.prototype.show = function() {
	console.log(this.gotText);
	console.log(this.lines);
}

TextHandler.prototype.createShipConfig = function(file){
  this.readSingleFile(file);
  if(this.lines.length >= 13){
  var config;
  config.shipName = this.lines[0];
  config.faction = this.lines[1];
  config.shipClass = this.lines[2];
  config.HP = parseInt(this.lines[3]);
  config.HPMod = 1;
  config.player = 0;
  config.atkList = this.lines[4];
  config.SDStr = parseInt(this.lines[5]);
  config.SDCapac = parseInt(this.lines[6]);
  config.SDMod = 1;
  config.SDRegen = parseInt(this.lines[7]);
  config.offenseMods = this.lines[8];
  config.defenseMods = this.lines[9];
  config.speed = this.lines[10];
  config.CMAA = this.lines[11];
  config.imgurl = this.lines[12];
}
}