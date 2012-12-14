var gameStatus = function(statusType, statusHandler, battlefield, scale, actions){
	this.statusType = statusType;
	this.battlefield = battlefield;
	this.statusHandler = statusHandler;
	this.spacejectCheck = this.statusHandler.lines[0]
	this.buttons = this.statusHandler.lines[1];
	this.buttonDirectory = this.statusHandler.lines[1].split(';');
	this.scale = scale;
	this.testVal = 1;
	this.imgList = [];
	this.actions = actions;
	this.initStatus();
	if (this.statusHandler.lines[2] !== 'None'){
		this.menurls = this.statusHandler.lines[2].split(';');
		this.getMenus();
	}
	else{
		this.menus = [];
	}
}

gameStatus.prototype.initStatus = function(){
	if (this.statusType !== "Don't do stuff"){
		this.buttonList = this.getButtonList();
		this.initFieldView();
	}
}

gameStatus.prototype.getMenus = function(){
	var menuHandler, i, len, preurl, menuConfig, newMenu, menus;
	menus = [];
	preurl = '/textfiles/Menus/'
	len = this.menurls.length;
	for(i=0;i<len;i++){		
		file = preurl + this.menurls[i];
		menuHandler = new TextHandler(file);
		menuConfig = menuHandler.createMenuConfig();
		newMenu = new Menu(menuConfig);
		menus.push(newMenu);
	}
	this.menus = menus;
}

gameStatus.prototype.getButtonList = function(){
	var i, len, buttonHandler, direct, buttonList, buttonConfig, newButton;
	if(this.buttons === "None" || this.buttons.slice(0,4) === "None"){
		return [];
	}
	else if(this.statusType === 'attackView'){
		return this.getAttackButtons();
	}
	else{
		len = this.buttonDirectory.length;
		buttonList = []
		for(i=0;i<len;i++){
			direct = '/textfiles/Buttons/' + this.buttonDirectory[i];
			buttonHandler = new TextHandler(direct)
			buttonConfig = buttonHandler.createButtonConfig();
			newButton = new gameButton(buttonConfig, this.scale, i);
			buttonList.push(newButton);
		}
		if(this.statusType === 'deployView'){
			buttonList = this.getShipButtons(buttonList);
		}
		
		return buttonList;
	}
}

gameStatus.prototype.getShipButtons = function(buttonList){
	var shipButtons, shipButton, len, i, buttonConfig, buttonHandler, preLen;
	preLen = buttonList.length;
	coords = this.battlefield.getCurrentCaptainCoords();
	currentCaptain = this.battlefield.fieldData[coords[0]][coords[1]];
	shipButtons = currentCaptain.deploys;
	len = shipButtons.length;
	for(i=0;i<len;i++){
		buttonHandler = new TextHandler('/textfiles/Buttons/' + shipButtons[i] + '.txt');
		buttonConfig = buttonHandler.createButtonConfig();
		shipButton = new gameButton(buttonConfig, this.scale, preLen + i);
		buttonList.push(shipButton);
	}
	return buttonList;
}

gameStatus.prototype.getAttackButtons = function(){
	var buttonHandler, buttonConfig, button;
	var buttonList = [];
	var ship = this.actions.active.ship;
	console.log(ship.atkList);
	for(var i = 0; i < ship.atkList.length; i++)
	{
		buttonHandler = new TextHandler('/textfiles/Buttons/chooseAttack.txt');
		buttonConfig = buttonHandler.createButtonConfig();
		buttonConfig.dy = buttonConfig.dy + i * 50;
		button = new gameButton(buttonConfig, this.scale, i);
		buttonList.push(button);
	}
	return buttonList;
}

gameStatus.prototype.initFieldView = function(){
	var spacejectList, spacejectCheck;
	spacejectCheck = whiteSpaceCheck(this.spacejectCheck);
	if(spacejectCheck  === 'true'){
		spacejectList = this.battlefield.spacejectList;
	}
	else{
		spacejectList = [];
	}
	this.createClickables(spacejectList, this.buttonList, 'shipView');

}

gameStatus.prototype.createClickables = function(spacejects, buttons,
	SPEH){ //SPEH = spaceject extra handler
	var newClick, clickables, i, statusKey;
	clickables = [];
	for(i=0; i<spacejects.length;i++){
		newClick = new Clickable(spacejects[i], SPEH);
		clickables.push(newClick);
	}
	for(i=0;i<buttons.length;i++){
		cButton = buttons[i];
		newClick = new Clickable(buttons[i]);
		clickables.push(newClick);
	}
	this.clickables = clickables.slice(0);
}

//Draw

gameStatus.prototype.drawMenus = function(scaledPage){
	var len, i;
	len = this.menus.length;
	for(i=0;i<len;i++){
		this.drawMenu(this.menus[i], scaledPage);
	}
}

gameStatus.prototype.drawMenu = function(menu, scaledPage){
	var x, y, xL, yL, mColor;
	x = menu.mx;
	y = menu.my;
	xL = menu.mW;
	yL = menu.mH;
	mColor = menu.menuColor;
	scaledPage.fillRect(x, y, xL, yL, mColor);
}

gameStatus.prototype.drawData = function(scaledPage, actions){
	if(this.statusType === 'deployStatView'){
		if(actions.deploy !== undefined){
			this.drawShipData(scaledPage, actions.deploy);
		}
	}
	else if(this.statusType === "attackView"){
		this.drawAttackMenuList(scaledPage, actions.active.ship);
	}
}

gameStatus.prototype.drawShipData = function(scaledPage, deploy){
	var deployUrl, deployHandler, deployConfig, img;
	deployUrl = '/textfiles/shipsdata/' + deploy + '.txt';
	deployHandler = new TextHandler(deployUrl);
	deployConfig = deployHandler.createShipConfig({});
	this.drawShipImage(scaledPage, deployConfig);
	this.drawShipTextData(scaledPage, deployConfig);

}

gameStatus.prototype.drawShipImage = function(scaledPage, config){
	boxHeight = 60;
	centerX = (scaledPage.canvas.width() / scaledPage.scale) / 6.7;
	centerY = (scaledPage.canvas.height() / scaledPage.scale) / 2.2;
	img = this.imageCheck(config);
	scaledPage.spaceShip(centerX, centerY, img, boxHeight);
}

gameStatus.prototype.drawShipTextData = function(scaledPage, config){
	var leftX, startY, centerX, rightX, nameFont, margin;
	leftX = (scaledPage.canvas.width() / scaledPage.scale) / 5;
	startY = (scaledPage.canvas.height() / scaledPage.scale) / 6;
	centerX = (scaledPage.canvas.width() / scaledPage.scale) / 3.3;
	rightX = (scaledPage.canvas.width() / scaledPage.scale) * 5 / 8;
	nameFont = (20*scaledPage.scale).toString() + 'px Impact'
	margin = 20;
	scaledPage.drawStatText(config.shipName, leftX, startY+40, 'center', nameFont); // draws name
	scaledPage.drawStatText('Class: ' + config.shipClass, centerX, startY, 'left');
	scaledPage.drawStatText('HP: ' + config.HP, centerX, startY + margin, 'left');
	this.drawAttackList(scaledPage, rightX, startY, config.atkList, margin, 'center');
	scaledPage.drawStatText('Shield Power: ' + config.SDStr, centerX, startY + margin*2, 'left');
	scaledPage.drawStatText('Shield Capacity: ' + config.SDCapac, centerX, startY + margin*3, 'left');
	scaledPage.drawStatText('Shield Regeneration: ' + config.SDRegen, centerX, startY + margin*4, 'left');
	scaledPage.drawStatText('Speed: ' + config.speed, centerX, startY + margin*5, 'left');
	scaledPage.drawStatText('Cost: ' + config.cost, centerX, startY + margin*6, 'left');
}

gameStatus.prototype.drawAttackList = function(scaledPage, x, y, atkList, margin, align){
	var i, len, atk, name, power, bpower, range, atkX, atkY, atkFont, text;
	len = atkList.length;
	scaledPage.drawStatText('Attacks', x-30, y, 'bold 15px Arial');
	atkFont = (10*this.scale).toString() + 'px Times'
	for(i=0;i<len;i++){
		atkY = y + margin*(i+1);
		atk = atkList[i];
		name = atk.atkName;
		power = atk.atkPower;
		bpower = atk.atkBPower;
		range = atk.atkRange;
		text = whiteSpaceCheck(name) + ": " + power + " Power, " + bpower + " Shield Damage.";
		scaledPage.drawStatText(text, x, atkY, align, atkFont);
	}
}

gameStatus.prototype.drawAttackMenuList = function(scaledPage, ship){
	var leftX, startY, rightX, text;
	leftX = (scaledPage.canvas.width() / scaledPage.scale) / 3.8;
	
	for(var i = 0; i < ship.atkList.length; i++)
	{
		text = ship.atkList[i].atkName;
		text += ": " + ship.atkList[i].atkPower + " Power, " + ship.atkList[i].atkBPower + " Shield Damage";
		startY = (62 + i * 50);
		scaledPage.drawAttackText(text, leftX, startY);
	}
}

gameStatus.prototype.imageCheck = function(config){
	var i, len, imgurl, newImg;
	imgurl = config.imgurl;
	len = this.imgList.length;
	for(i=0;i<len;i++){
		if(pathComparison(this.imgList[i].src, imgurl)){
			return this.imgList[i];
		}
	}
	newImg = new Image();
	newImg.src = imgurl;
	this.imgList.push(newImg);
	return newImg;
}

gameStatus.prototype.drawButtons = function(scaledPage){
	var len, i;
	len = this.buttonList.length;
	for(i=0;i<len;i++){
		this.drawButton(this.buttonList[i], scaledPage, i);

	}
}

gameStatus.prototype.drawButton = function(button, scaledPage, i){
	var x, y, xL, yL, bColor, bImg, bImgurl, text;
	x = button.dx;
	y = button.dy;
	xL = button.bWidth;
	yL = button.bHeight;
	if (button.clickChange){
		bColor = button.altColor;
		if(!pathComparison(button.bImg.src, button.altImgurl)){
			button.bImg.src = button.altImgurl;
		}


	}
	else{
		bColor = button.bColor;
		if(!pathComparison(button.bImg.src, button.bImgurl)){
			button.bImg.src = button.bImgurl;
		}
	}
	text = button.displayText;
	//console.log(button, x, y, xL, yL, bColor, text);
	if(button.imageStatus === undefined){
			scaledPage.fillRect(x,y,xL,yL,bColor);
	//console.log('drawbuttontext');
	scaledPage.drawButtonText(x,y,xL,yL,text);
	}
	else{
		scaledPage.drawButtonImg(x, y, xL, yL, button.bImg);
	}
}
