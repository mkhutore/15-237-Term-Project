var Battlefield = function(config, user, myTurn){
	this.width = config.width;
	this.height = config.height;
	this.gridVal = 8;
	this.player1 = config.player1;
	this.player2 = config.player2;
	console.log(user, 'is user');
	this.user = user;
	this.myTurn = myTurn;
	this.scale = config.scale;
	this.sqLength = Math.min(this.width, this.height) / this.gridVal;
	this.fieldRows = this.width/this.sqLength;
	this.fieldCols = this.height/this.sqLength;
	this.fieldData = this.createField();
	this.spacejectList = [];
	this.highlights = [];
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
	ship = 'TestShip';
	//this.createShip(ship, 0, 0, config.scale);
}

Battlefield.prototype.initCaptains = function(){
	var sqLength, scale, shipone, shiptwo;
	sqLength = this.sqLength;
	scale = this.scale;
	shipone = {'gridXLocation': 0, 'gridYLocation': this.gridVal/2, 'player' : this.player1, 'scale': scale, 'sqLength':sqLength}
	shiptwo = {'gridXLocation': this.fieldRows-1, 'gridYLocation': this.gridVal/2, 'player': this.player2, 'scale': scale, 'sqLength':sqLength}
	cptFile1 = '/textfiles/shipsdata/CaptainShips/TestCaptain1.txt'
	cptFile2 = '/textfiles/shipsdata/CaptainShips/TestCaptain2.txt'
	this.shipHandler = new TextHandler(cptFile1);
	this.shipConfig = this.shipHandler.createShipConfig(shipone);
	this.fieldData[0][this.gridVal/2] = new captainShip(this.shipConfig);
	this.captain1 = this.fieldData[0][this.gridVal/2];
	this.spacejectList.push(this.fieldData[0][this.gridVal/2]);
	this.shipHandler = new TextHandler(cptFile2);
	this.shipConfig = this.shipHandler.createShipConfig(shiptwo);
	this.fieldData[this.fieldRows-1][this.gridVal/2] = 
	new captainShip(this.shipConfig);
	this.captain2 = this.fieldData[this.fieldRows-1][this.gridVal/2];
	this.spacejectList.push(this.fieldData[this.fieldRows-1][this.gridVal/2])
}

Battlefield.prototype.getCurrentCaptainCoords = function(){
	var i, j;
	for(i=0;i<this.fieldRows;i++){
		for(j=0;j<this.fieldCols;j++){
			if(this.fieldData[i][j] !== 0){
				if((this.fieldData[i][j].shipClass === 'Captain') && (this.fieldData[i][j].player === this.user)){
					return [i, j];
				}
			}
		}
	}
	if(this.captain1.player === this.user){
		return this.captain1;
	}
	else{
		return this.captain2;
	}
}

Battlefield.prototype.getCaptainCoords = function(player){
	var i, j;
	for(i=0;i<this.fieldRows;i++){
		for(j=0;j<this.fieldCols;j++){
			if(this.fieldData[i][j] !== 0){
				if((this.fieldData[i][j].shipClass === 'Captain') && (this.fieldData[i][j].player === player)){
					return [i, j];
				}
			}
		}
	}
}


Battlefield.prototype.deployCheck = function(config, sx, sy){
	var checker = true;
	currentCaptainCoords = this.getCurrentCaptainCoords();
	checker = this.checkCoords(sx, sy) && checker;
	checker = this.costCheck(currentCaptainCoords, config.cost) && checker;
	checker = this.deploysCheck(currentCaptainCoords) && checker;
	return checker;
}

Battlefield.prototype.costCheck = function(coords, cost){
	if(cost > this.fieldData[coords[0]][coords[1]].energy){
		return false;
	}
	else{
		return true;
	}
}

Battlefield.prototype.deploysCheck = function(coords){
	if(this.fieldData[coords[0]][coords[1]].deployed >= 3){
		return false;
	}
	else{
		return true;
	}
}

Battlefield.prototype.createShip = function(ship, bx, by, scale){
	if(this.fieldData[bx][by] === 0){
	var file = '/textfiles/shipsdata/' + ship + '.txt';
	baseConfig = {'gridXLocation' : bx, 'gridYLocation': by,
		'textType' : "Ship", 'file' : file, 'scale' : scale,
		'sqLength' : this.sqLength, 'player': this.user };
	this.shipHandler = new TextHandler(file);
	this.shipConfig = this.shipHandler.createShipConfig(baseConfig);
	var newShip = new Ship(this.shipConfig);
	this.fieldData[bx][by] = newShip;
	this.spacejectList.push(newShip);
	var coords = this.getCurrentCaptainCoords();
	coordsX = coords[0];
	coordsY = coords[1];
	this.fieldData[coordsX][coordsY].energy -= newShip.cost;
	this.fieldData[coordsX][coordsY].deployed++;
}
}

Battlefield.prototype.checkCoords = function(bx, by){
	if(this.fieldData[bx][by] === 0 && this.highlightscheck(bx, by)){
		return true;
	}
	else{
		return false;
	}
}

Battlefield.prototype.highlightscheck = function(bx, by){
	var highlights, highlight, len, i;
	hightlights = this.highlights;
	len = hightlights.length;
	for(i=0;i<len;i++){
		highlight = hightlights[i];
		if(highlight[0] === bx && highlight[1] === by) return true;
	}
	return false;
}

Battlefield.prototype.draw = function(scaledPage,status){
	var i;
	var j;
	for(i = 0; i < this.highlights.length; i++)
	{
		var x = this.highlights[i][0];
		var y = this.highlights[i][1];
		scaledPage.fillRect(x * this.sqLength, y * this.sqLength, this.sqLength, this.sqLength, this.highlightColor);
	}
	
	for (i=0;i<this.fieldRows;i++)
	{
		currentX = i*this.sqLength;
		for (j=0;j<this.fieldCols;j++)
		{
			currentY = j*this.sqLength;
			scaledPage.lineRect(currentX, currentY, this.sqLength, this.sqLength);
			if (this.fieldData[i][j].typeName === "SpaceJect")
			{
				var color = "#FFFFFF";
				if(this.fieldData[i][j].player === this.player1)
					color = "rgba(178, 44, 170, .5)";
				else if(this.fieldData[i][j].player === this.player2)
					color = "rgba(44, 164, 178, .5)";
				scaledPage.fillRect(i * this.sqLength, j * this.sqLength, this.sqLength, this.sqLength, color);
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
	//scaledPage.drawStatus(status);
}

Battlefield.prototype.drawCaptainStats = function(scaledPage, clicked){
	var player, ttext;
	player = clicked.player;
	if(player !== undefined){
		coords = this.getCaptainCoords(player);
	}
	else{
		coords = this.getCurrentCaptainCoords();
	}
	var captain = this.fieldData[coords[0]][coords[1]];
	var ttext1 = 'Current Stats: ';
	var ttext2 = 'Energy: ';
	var energy = captain.energy;
	var ttext3 = '; Remaining deploys: '
	var deployed = 3 - captain.deployed;
	var ttext4 = '; Remaining Fuel: ';
	var fuel = captain.speed - captain.moved;
	var ttext5 = '; Attacks: ';
	var attacks = (1 - (captain.attacked*1)).toString();
	ttext = ttext1 + ttext2 + energy + ttext3 + deployed + ttext4 + fuel + ttext5 + attacks;
	scaledPage.drawStatText(ttext, 110, 260, 'left');
	var btext1 = 'HP: ';
	var HP = captain.currentHP;
	var btext2 = '; Shield: ';
	var shield = captain.currentSDCapac;
	btext = btext1 + HP + btext2 + shield;
	scaledPage.drawStatText(btext, 110, 280, 'left');
}

Battlefield.prototype.drawShipStats = function(scaledPage, ship){
	var player, ttext;
	var ttext1 = 'Current Stats: ';
	var ttext2 = 'HP: ';
	var HP = ship.currentHP;
	var shield = ship.currentSDCapac;
	var ttext3 = '; Shield: '
	var ttext4 = '; Remaining Fuel: ';
	var fuel = ship.speed - ship.moved;
	var ttext5 = '; Attacks: ';
	var attacks = (1 - (ship.attacked*1)).toString();
	ttext = ttext1 + ttext2 + HP + ttext3 + shield + ttext4 + fuel + ttext5 + attacks;
	scaledPage.drawStatText(ttext, 110, 260, 'left');
}

Battlefield.prototype.getFieldCoords = function(x, y){
	var fieldX = Math.floor(x / this.sqLength);
	var fieldY = Math.floor(y / this.sqLength);
	return [fieldX, fieldY];
}

Battlefield.prototype.move = function(ship, coords){
	var oldx = ship.gridXLocation;
	var oldy = ship.gridYLocation;
	var newx = coords[0];
	var newy = coords[1];
	this.fieldData[oldx][oldy] = 0;
	this.fieldData[newx][newy] = ship;
	
	for(var i = 0; i < this.spacejectList.length; i++)
	{
		if(this.spacejectList[i].gridXLocation === oldx && this.spacejectList[i].gridYLocation === oldy)
		{
			this.spacejectList[i].gridXLocation = newx;
			this.spacejectList[i].gridYLocation = newy;
			this.spacejectList[i].dimensions = this.spacejectList[i].createDimensions(newx, newy, 
						this.spacejectList[i].cscale, this.spacejectList[i].sqLength);
		}
	}
	this.highlights = [];
}

Battlefield.prototype.remove = function(ship){
	var x = ship.gridXLocation;
	var y = ship.gridYLocation;
	
	this.fieldData[x][y] = 0;
	
	for(var i = 0; i < this.spacejectList.length; i++)
	{
		if(this.spacejectList[i].gridXLocation === x && this.spacejectList[i].gridYLocation === y)
		{
			this.spacejectList.splice(i, 1);
		}
	}
}

Battlefield.prototype.moveHighlight = function(ship){
	var highlight = [];
	var speed = ship.speed;
	for(var i = -speed; i <= speed; i++)
	{
		for(var j = -speed; j <= speed; j++)
		{
			var x = ship.gridXLocation + i;
			var y = ship.gridYLocation + j;
			if(x >= 0 && x < this.fieldRows && Math.abs(i) + Math.abs(j) <= speed)
			{
				if(y >= 0 && y < this.fieldCols && this.fieldData[x][y] === 0)
					highlight.push([x, y]);
			}
		}
	}
	this.highlights = highlight;
	this.highlightColor = "rgba(247, 255, 32, .5)";
}

Battlefield.prototype.deployHighlight = function(ship){
	var highlight = [];
	var deployRange = ship.deployRange;
	for(var i = -deployRange; i <= deployRange; i++)
	{
		for(var j = -deployRange; j <= deployRange; j++)
		{
			var x = ship.gridXLocation + i;
			var y = ship.gridYLocation + j;
			if(x >= 0 && x < this.fieldRows && Math.abs(i) + Math.abs(j) <= deployRange)
			{
				if(y >= 0 && y < this.fieldCols && this.fieldData[x][y] === 0)
					highlight.push([x, y]);
			}
		}
	}
	this.highlights = highlight;
	this.highlightColor = "rgba(2, 255, 3, .5)";
}

Battlefield.prototype.captainDeadCheck = function(){
	if(this.fieldView !== undefined){
	var p1coords, p2coords, p1x, p1y, p2x, p2y;
	p1coords = this.getCaptainCoords(this.player1);
	p2coords = this.getCaptainCoords(this.player2);
	p1x = p1coords[0];
	p1y = p1coords[1];
	p2x = p2coords[0];
	p2y = p2coords[1];
		if(this.fieldView[p1x][p1y].currentHP <= 0 || this.fieldView[p2x][p2y].currentHP <= 0){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}

Battlefield.prototype.attackHighlight = function(ship, attack){
	var highlight = [];
	var range = attack.atkRange[0];
	console.log(ship);
	console.log(attack);
	
	if(range[0] === "Square")
	{
		for(var i = -range[1]; i <= range[1]; i++)
		{
			for(var j = -range[1]; j <= range[1]; j++)
			{
				var x = ship.gridXLocation + i;
				var y = ship.gridYLocation + j;
				if(x >= 0 && x < this.fieldRows && Math.abs(i) + Math.abs(j) <= range[1])
				{
					if(y >= 0 && y < this.fieldCols)
						highlight.push([x, y]);
				}
			}
		}
	}
	else if(range[0] === "Line")
	{
		for(var i = -range[1]; i <= range[1]; i++)
		{
			var x = ship.gridXLocation + i;
			var y = ship.gridYLocation;
			highlight.push([x, y]);
			x -= i;
			y += i;
			highlight.push([x, y]);
		}
	}
	
	this.highlights = highlight;
	this.highlightColor = "rgba(255, 29, 29, .5)";
}
