var gameStatus = function(statusType, statusHandler, battlefield, scale){
	this.statusType = statusType;
	this.battlefield = battlefield;
	this.statusHandler = statusHandler;
	this.spacejectCheck = this.statusHandler.lines[0]
	this.buttons = this.statusHandler.lines[1];
	this.buttonDirectory = this.statusHandler.lines[1].split(';');
	this.scale = scale;
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
	else{
		len = this.buttonDirectory.length;
		buttonList = []
		console.log(this.buttonDirectory);
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
	var shipButtons, shipButton, len, i, buttonConfig, buttonHandler;
	currentCaptain = this.battlefield.getCurrentCaptain();
	console.log(currentCaptain);
	shipButtons = currentCaptain.deploys;
	len = shipButtons.length;
	for(i=0;i<len;i++){
		buttonHandler = new TextHandler('/textfiles/Buttons/' + shipButtons[i] + '.txt');
		buttonConfig = buttonHandler.createButtonConfig();
		shipButton = new gameButton(buttonConfig);
		buttonList.push(shipButton);
	}
	return buttonList;
}

gameStatus.prototype.initFieldView = function(){
	var spacejectList, spacejectCheck;
	spacejectCheck = this.spacejectCheck.slice(0,this.spacejectCheck.length-1);
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
	var newClick;
	var clickables = [];
	var i;
	var statusKey;
	for(i=0; i<spacejects.length;i++){
		newClick = new Clickable(spacejects[i], SPEH);

		clickables.push(newClick);
	}
	for(i=0;i<buttons.length;i++){
		cButton = buttons[i];
		newClick = new Clickable(buttons[i]);
		clickables.push(newClick);
	}
	this.clickables = clickables;
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
			console.log("asdf");
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
