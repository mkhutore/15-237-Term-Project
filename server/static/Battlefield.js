var Battlefield = function(config){
	this.width = config.width;
	this.height = config.height;
	this.gridVal = 8;
	this.sqLength = Math.min(this.width, this.height) / this.gridVal;
	this.fieldRows = this.width/this.sqLength;
	this.fieldCols = this.height/this.sqLength;
	this.fieldData = this.createField();
	this.spacejectList = config.spacejects;
	this.shipHandler;
	if(this.spacejectList.length === 0)
	{
		this.initField();
	}
	this.testcounter = true;
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

Battlefield.prototype.initField = function(){
	this.initCaptains();
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
			scaledPage.fillRect(100,100,200,150,'red');
	}
}
