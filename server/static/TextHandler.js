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
}

TextHandler.prototype.show = function() {
	console.log("GotText", this.gotText);
	console.log("Lines", this.lines);
}

TextHandler.prototype.createSpaceJectConfig = function(baseConfig){
  var config, statusKey, len;
  config = baseConfig;
  len = this.lines.length;
  statusKey = this.getStatusKey(this.lines[len-1]);
  config.statusKey = statusKey;
  return config;
}

TextHandler.prototype.getStatusKey = function(file){
  var directory;
  directory = '/textfiles/statuskeys/'
  fileDirect = directory + file;
  this.keyHandler = new TextHandler(fileDirect);
  return this.keyHandler.createKeyConfig(this.keyHandler.lines[0]);
}

TextHandler.prototype.createKeyConfig = function(line){
  var len, i, j, prekey, key, temp, tempLen, keyLines;
  if(line !== undefined){
  keyLines = line.split(';');
  len = keyLines.length;
  key = {};
  for(i=0;i<len;i++){
    prekey = keyLines[i].split(':');
    for(j=0;j<prekey.length;j++){
      temp = prekey[j];
      tempLen = temp.length;
      if(!withinDims(temp.charCodeAt(tempLen-1),65,122)) //removes whitespace
      {
        prekey[j] = temp.slice(0,temp.length-1);
      }
    }
    key[prekey[0]] = prekey[1]; //the prekey will always have two sections
  }
  return key;
}
  else{
    return {};
  }
}

TextHandler.prototype.createShipConfig = function(baseConfig){
  if(this.lines.length >= 14){
      var config;
      config = this.createSpaceJectConfig(baseConfig);
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
      config.offenseMods = this.lines[8].split(';');
      config.defenseMods = this.lines[9].split(';');
      config.speed = this.lines[10];
      config.CMAA = this.lines[11];
      config.imgurl = this.lines[12];
      config.cost = this.lines[13];
  }
  if(config.shipClass !== 'Captain'){
      return config;
  }
  else{
    return this.createCaptainConfig(config);
  }
}

TextHandler.prototype.createCaptainConfig = function(baseConfig){
  if(this.lines.length >= 18)
  {
    baseConfig.energy = parseInt(this.lines[14]);
    baseConfig.energyRegen = parseInt(this.lines[15]);
    baseConfig.deploys = this.lines[16].split(';');
    baseConfig.deployRange = parseInt(this.lines[17]); //for now anyway
  }
  return baseConfig;
}

TextHandler.prototype.getAttackList = function(attacks){
  textList = attacks.split(';');
  atkList = [];
  var i; 
  for(i=0;i<textList.length;i++){
    atkFile = ('/textfiles/attacks/' + textList[i] + '.txt');
    this.attackHandler = new TextHandler(atkFile);
    var config = this.attackHandler.createAttackConfig();
    atk = new Attack(config);
    atkList.push(atk);
  }
  return atkList;
}

TextHandler.prototype.makeAttackConfig = function(){
  this.atkConfig = this.attackHandler.createAttackConfig();
}

TextHandler.prototype.createAttackConfig = function(){
  var config = {};
  if(this.lines.length > 5){
    config.atkName = this.lines[0];
    config.atkPower = parseInt(this.lines[1]);
    config.atkBPower = parseInt(this.lines[2]);
    config.atkStatuses = this.lines[3].split(';');
    config.atkElements = this.lines[4].split(';');
    atkRangeList = this.lines[5].split(';');
    var i;
    for(i=0;i<atkRangeList.length;i++){
      atkRangeList[i] = atkRangeList[i].split(':');
    }
    config.atkRange = atkRangeList;
  }
  return config;
}

TextHandler.prototype.createMenuConfig = function(){
  var config;
  config = {};
  config.menuName = this.lines[0];
  config.mx = parseInt(this.lines[1]); //menu x, y, width, height below
  config.my = parseInt(this.lines[2]);
  config.mW = parseInt(this.lines[3]);
  config.mH = parseInt(this.lines[4]);
  config.menuColor = this.lines[5];
  return config;
}
TextHandler.prototype.createButtonConfig = function(){
  var config;
  console.log(this.lines);
  config = {};
  config.buttonName = this.lines[0];
  config.dx = parseInt(this.lines[1]);
  config.dy = parseInt(this.lines[2]);
  config.bWidth = parseInt(this.lines[3]);
  config.bHeight = parseInt(this.lines[4]);
  config.altColor = this.lines[5];
  config.displayText = this.lines[6];
  config.bColor = this.lines[7];
  config.statusKey = this.createKeyConfig(this.lines[8]);
  config.changeKey = this.createKeyConfig(this.lines[9]);
  return config;
}

TextHandler.prototype.createStatusConfig = function(){
  
}