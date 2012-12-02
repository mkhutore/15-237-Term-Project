var TextHandler = function(file){
  this.file = file;
  this.readSingleFile(this.file);
}


TextHandler.prototype.readSingleFile = function(file) {
  $.ajax({
    async: false,
    type: 'GET',
    url: file,
    success: this.textGet.bind(this)
});
}

TextHandler.prototype.textGet = function(e) {
	this.gotText = e;
	this.lines = e.split('\n');
  console.log(this.lines);
}

TextHandler.prototype.show = function() {
	console.log("GotText", this.gotText);
	console.log("Lines", this.lines);
}

TextHandler.prototype.createShipConfig = function(baseConfig){
  if(this.lines.length >= 13){
      var config;
      if(config === undefined){
        config = baseConfig // past config
      }
      config.shipName = this.lines[0];
      config.faction = this.lines[1];
      config.shipClass = this.lines[2];
      config.HP = parseInt(this.lines[3]);
      config.HPMod = 1;
      config.player = 0;
      config.atkList = this.getAttackList(this.lines[4]);
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
  return config;
}

TextHandler.prototype.getAttackList = function(attacks){
  textList = attacks.split(';');
  atkList = [];
  for(i=0;i<textList.length;i++){
    atkFile = ('/textfiles/attacks/' + textList[i] + '.txt');
    this.attackHandler = new TextHandler(atkFile);
    var config = this.attackHandler.createAttackConfig();
    console.log(this.attackHandler, 'attackhandler');
    atk = new Attack(config);
    atkList.push(atk);
  }
  return atkList;
}

TextHandler.prototype.makeAttackConfig = function(){
  this.atkConfig = this.attackHandler.createAttackConfig();
}

TextHandler.prototype.createAttackConfig = function(){
  console.log('attackconfig', this.lines)
  var config = {};
  if(this.lines.length > 5){
    config.atkName = this.lines[0];
    config.atkPower = parseInt(this.lines[1]);
    config.atkBPower = parseInt(this.lines[2]);
    config.atkStatuses = this.lines[3].split(';');
    config.atkElements = this.lines[4].split(';');
    atkRangeList = this.lines[5].split(';');
    for(i=0;i<atkRangeList.length;i++){
      atkRangeList[i] = atkRangeList[i].split(':');
    }
    config.atkRange = atkRangeList;
  }
  console.log(config, 'final config');
  return config;
}