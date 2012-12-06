var Battlefield = function(config){
	this.width = config.width;
	this.height = config.height;
	this.gridVal = 8;
	this.sqLength = Math.min(this.width, this.height) / this.gridVal;
	this.fieldRows = this.width/this.sqLength;
	this.fieldCols = this.height/this.sqLength;
	this.fieldData = this.createField();
	this.spacejectList = [];
	this.shipHandler;
	if(config.spacejects.length === 0)
	{
		this.initField(config);
	}
	else{
		this.buildField(config.spacejects);
	}
	this.testcounter = true;
}

Battlefield.prototype.buildField = function(){
	var i, j, s, tempList, lenI, lenJ, lenS, tempJect;
	tempList = config.spacejects.slice(0);
	lenI = this.fieldData.length;
	lenJ = this.fieldData[0].length;
	for(i=0;i<lenI;i++){
		for(j=0;j<lenJ;j++)
		{
			lenS = tempList.length;
			for(s=lenS;s>0;s--){
				if((tempList[s].gridXLocation === i) &&
				 (tempList[s].gridYLocation === j)){
					tempJect = tempList[s];
					this.fieldData[i][j] = tempJect;
				}
			}
		}
	}
}
Battlefield.prototype.createField = function(){
	var fieldData = Array(this.fieldRows);
	var i;
	var j;
	for (i=0;i<this.fieldRows;i++)
	{
		fieldData[i] = Array(this.fieldCols);
		for(j=0;j<this.fieldCols;j++)
		{
			fieldData[i][j] = 0; 
		}
	}
	return fieldData;
}

Battlefield.prototype.initField = function(config){
	this.initCaptains();
	this.createShip(0, 0, config.scale);
}

Battlefield.prototype.initCaptains = function(){
	var shipone = {'gridXLocation': 0, 'gridYLocation': this.gridVal/2}
	var shiptwo = {'gridXLocation': this.fieldRows-1, 'gridYLocation': this.gridVal/2}
	cptFile1 = '/textfiles/shipsdata/CaptainShips/TestCaptain1.txt'
	cptFile2 = '/textfiles/shipsdata/CaptainShips/TestCaptain2.txt'
	this.shipHandler = new TextHandler(cptFile1);
	this.shipConfig = this.shipHandler.createShipConfig(shipone);
	this.fieldData[0][this.gridVal/2] = new captainShip(this.shipConfig);
	this.spacejectList.push(this.fieldData[0][this.gridVal/2]);
	this.shipHandler = new TextHandler(cptFile2);
	this.shipConfig = this.shipHandler.createShipConfig(shiptwo);
	this.fieldData[this.fieldRows-1][this.gridVal/2] = 
	new captainShip(this.shipConfig);
	this.spacejectList.push(this.fieldData[this.fieldRows-1][this.gridVal/2])
}

Battlefield.prototype.createShip = function(bx, by, scale){
	if(this.fieldData[bx][by] === 0){
	var file = '/textfiles/shipsdata/TestShip.txt';
	baseConfig = {'gridXLocation' : bx, 'gridYLocation': by,
		'textType' : "Ship", 'file' : file, 'scale' : scale,
		'sqLength' : this.sqLength };
	this.shipHandler = new TextHandler(file);
	this.shipConfig = this.shipHandler.createShipConfig(baseConfig);
	var newShip = new Ship(this.shipConfig);
	this.fieldData[bx][by] = newShip;
	this.spacejectList.push(newShip);
}
}


Battlefield.prototype.draw = function(scaledPage,status){
	scaledPage.drawStatus(status);
	var i;
	var j;
	for (i=0;i<this.fieldRows;i++)
	{
		currentX = i*this.sqLength;
		for (j=0;j<this.fieldCols;j++)
		{
			currentY = j*this.sqLength;
			scaledPage.lineRect(currentX, currentY, this.sqLength, this.sqLength);
			if (this.fieldData[i][j].typeName === "SpaceJect")
			{
				this.fieldData[i][j].draw(scaledPage, currentX, currentY, this.sqLength);
				if(this.testcounter){
					this.testcounter = false;
				}
			}
		}
	}
		if(status === 'shipView'){
			//scaledPage.fillRect(100,100,200,150,'red');
	}
}
