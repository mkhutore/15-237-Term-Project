var Battlefield = function(config){
	this.width = config.width;
	this.height = config.height;
	this.gridVal = 12;
	this.sqLength = Math.min(this.width, this.height) / this.gridVal;
	this.fieldRows = this.width/this.sqLength;
	this.fieldCols = this.height/this.sqLength;
	this.fieldData = this.createField();
	this.spacejectList = [];
	this.initField();
	console.log(this.fieldData[0]);
	this.testcounter = true;
}

Battlefield.prototype.createField = function(){
	var fieldData = Array(this.fieldRows);
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
	this.fieldData[0][this.gridVal/2] = new Ship(shipone);
	this.spacejectList.push(this.fieldData[0][this.gridVal/2])
	this.fieldData[this.fieldRows-1][this.gridVal/2] = 
	new Ship(shiptwo);
	this.spacejectList.push(this.fieldData[this.fieldRows-1][this.gridVal/2])
}

Battlefield.prototype.createShip = function(bx, by){
	this.fieldData[bx][by] = new Ship({'gridXLocation': bx, 'gridYLocation': by})
}

Battlefield.prototype.draw = function(scaledPage){
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
					console.log(this.fieldData[i][j].dimensions);
					this.testcounter = false;
				}
			}
		}
	}
}
