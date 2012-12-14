var SpaceGame = function(){
    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.draw.bind(this));
}

//SETUP

SpaceGame.prototype.setup = function(){
    window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
	this.user = this.getSessionCookie()["user"];
	this.getData();
    this.initCanvas();
    //TouchHandler.init(this);
    this.initAccelerometer();
}

SpaceGame.prototype.getData = function(){
	var gameId = this.getSessionCookie()["id"];
	var req = $.ajax({
        url: '/db/game',
        type: 'POST',
        data: {"id" : gameId}});
    req.done(function(game){
		console.log(game);
		this.player1 = game.player1;
		this.player2 = game.player2;
		this.initBattlefield(game.objects, this.player1, this.player2);
		this.draw();
		this.initStatus();
	}.bind(this));
}

SpaceGame.prototype.getSessionCookie = function(){
	var cookieArray = document.cookie.split(';');
	var cookies = {};
	for (var i = 0; i < cookieArray.length; i++){
		var parts = cookieArray[i].split('=');
		var key = parts[0].trim();
		var value = parts[1];
		cookies[key] = value;
	}
	
	return cookies;
}

SpaceGame.prototype.initBattlefield = function(objects, player1, player2){
    this.battlefield = new Battlefield({'width':this.width,
     'height':this.height, 'spacejects':objects, 'scale':this.page.scale,
    'player1' : player1, 'player2': player2}, this.user);
}

SpaceGame.prototype.initStatus = function(){
    var statusHandler, file;
    file = '/textfiles/statuses/FieldView.txt';
    statusHandler = new TextHandler(file);
    this.currentStatus = new gameStatus('FieldView', statusHandler, this.battlefield);
    this.actions = {};
}

SpaceGame.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = 720;
    this.height = 320;
    this.backgroundImg = new Image();
    this.backgroundImg.src = 'images/Space_bg2.gif';
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    $(this.canvas).attr("unselectable", "on");
    this.pointed = new Pointed({'x':0,'y':0,'handled':true, 'pointType':'None'});
    this.released = new Pointed({'x':0, 'y':0, 'handled': true, 'pointType':'None'});
    if(!window.util.isIOS() && !window.util.isAndroid())
        {
            $(this.canvas).bind('mousedown', this.onClickStart.bind(this));
        }
    else{
        $(this.canvas).bind('touchstart', this.onClickStart.bind(this));
    }
    if(!window.util.isIOS() && (!window.util.isAndroid())){
        $(this.canvas).bind('mouseup', this.onClickEnd.bind(this));
    }
    else{
        $(this.canvas).bind('touchend', this.onClickEnd.bind(this));
    }
    this.page = new ScaledPage(this.canvas, this.width);
}

SpaceGame.prototype.onClickStart = function(event){ //this.pointed calls the current pointed
    var differ, coorX, coorY;
    if(event.type === 'touchstart'){
        coorX = event.originalEvent.targetTouches[0].pageX;
        coorY = event.originalEvent.targetTouches[0].pageY;
    }
    else{
        coorX = event.pageX;
        coorY = event.pageY;
    }
    coorX -= $(this.canvas).offset().left;
    coorY -= $(this.canvas).offset().top;
    differ = 'pointed';
    this[differ]= new Pointed({'x': coorX, 'y': coorY, 'handled' : false,
        'pointType' : 'click'});
    /* console.log('Cursor at ' + event.pageX + ', ' + event.pageY + '\n Offset '
            + $(this.canvas).offset().left + ', ' + $(this.canvas).offset().top + '\n Pointed ='
            + this[differ].x + ',' + this[differ].y + ',' + this[differ].handled); */
    console.log(this[differ]);
}

SpaceGame.prototype.onClickEnd = function(event){ //this.pointed calls the current pointed
    var differ, coorX, coorY;
    if(event.type === 'touchend'){
        coorX = event.originalEvent.changedTouches[0].pageX;
        coorY = event.originalEvent.changedTouches[0].pageY;
    }
    else{
        coorX = event.pageX;
        coorY = event.pageY;
    }
    //alert(coorX);
    //alert(coorY);
    coorX = coorX - $(this.canvas).offset().left;
    coorY = coorY -  $(this.canvas).offset().top;
    differ = 'released';
    this[differ]= new Pointed({'x': coorX, 'y': coorY, 'handled' : false,
        'pointType' : 'click'});
    /* console.log('Cursor at ' + event.pageX + ', ' + event.pageY + '\n Offset '
            + $(this.canvas).offset().left + ', ' + $(this.canvas).offset().top + '\n Pointed ='
            + this[differ].x + ',' + this[differ].y + ',' + this[differ].handled); */
    console.log(this[differ]);
}

SpaceGame.prototype.initAccelerometer = function(){
    this.accelerometer = new Accelerometer();
    this.accelerometer.startListening();
}


//==============================================
//DRAWING
//==============================================

SpaceGame.prototype.draw = function(timeDiff){
	if(this.battlefield != undefined)
	{
		this.clearPage();
		this.updateBattlefield();
        var currentStatus;
        if(this.currentStatus !== undefined){
            currentStatus = this.currentStatus.statusType;
        }
        else{
            currentStatus = "FieldView";
        }
		this.battlefield.draw(this.page, currentStatus);
        if(this.currentStatus !== undefined){
            this.currentStatus.drawMenus(this.page);
            this.currentStatus.drawData(this.page, this.actions);
            this.currentStatus.drawButtons(this.page);

        }
        if (this.actions !== undefined && this.actions.dtext !== undefined){
            this.page.drawDtext(this.actions.dtext);
        }
	}
}

SpaceGame.prototype.clearPage = function(){
    this.page.drawBackground(this.backgroundImg, this.width,
     this.height);
}

SpaceGame.prototype.updateBattlefield = function(){
    if(this.released.handled === false || this.pointed.handled === false){
        this.handlePointer();
    }
}

SpaceGame.prototype.handlePointer = function(){
    var px, py, rx, ry, clickables, i, currentScale, testHandler;
    clickables = this.currentStatus.clickables.slice(0);
    px = this.pointed.x;
    py = this.pointed.y;
    rx = this.released.x;
    ry = this.released.y;
    var currentStatusType = this.currentStatus.statusType;
    currentScale = this.page.scale;
    if(this.released.handled === false){
        this.actionCheck(rx, ry);
    }
    for(i=0;i<clickables.length;i++){
        if (clickables[i].clickCheck(px, py)){
                this.changeAnimation(clickables[i], true);
                this.pointed.handled = true;
            if(clickables[i].clickCheck(rx, ry) && this.released.handled === false){
                this.buttonCheck(currentStatusType, clickables[i]);
                var statusType = clickables[i].statusKey[currentStatusType];
                var statusHandler = new TextHandler('/textfiles/statuses/' + statusType + '.txt');
                this.currentStatus = new gameStatus(statusType, statusHandler,
                    this.battlefield, currentScale); 
                this.pointed.handled = true;
                this.released.handled = true;
            }
            else if(this.released.handled === false){
                this.changeAnimation(clickables[i], false);
                this.released.handled = true;
            }
        }
    }
    if(this.pointed.handled === false || this.released.handled === false){
        if(this.checkMenu(px, py, rx, ry)){
            this.pointed.handled = true;
            this.released.handled = true;
            }

        }
    }

SpaceGame.prototype.actionCheck = function(rx, ry){
    if(this.currentStatus.statusType === 'shipMove'){
        alert("Movin!"); 
    }
    if(this.currentStatus.statusType === 'shipTarget'){
        alert("attackin!");
    }
}

SpaceGame.prototype.buttonCheck = function(currentStatusType, clicked){
    if(clicked.typeName === 'button'){
        if(currentStatusType === 'deployView'){
            if(clicked.buttonName !== undefined){
                this.actions.deploy = clicked.buttonName;
            }
        }
    }
}


SpaceGame.prototype.changeAnimation = function(clicked, changebool){
    var shorter, lIndex;
    if (clicked.typeName === 'button'){
        if (clicked.altImgurl !== undefined){
            lIndex = clicked.lIndex;
            this.currentStatus.buttonList[lIndex].clickChange = changebool;
        }
        else if (clicked.altColor !== undefined){
            lIndex = clicked.lIndex;
            //shorter = this.currentStatus.buttonList[lIndex].clickChange;
            this.currentStatus.buttonList[lIndex].clickChange = changebool;
        }
    }
}

SpaceGame.prototype.checkMenu = function(px, py, rx, ry){
    var i, len, menus, mx, my, mW, mH;
    menus = this.currentStatus.menus;
    len = menus.length;
    for(i=0;i<len;i++){
        mx = menus[i].mx;
        my = menus[i].my;
        mW = menus[i].mW;
        mH = menus[i].mH;
        mxf = mx + mW;
        myf = my + mH;
        if(dimensionsCheck(px, py, mx, my, mxf, myf) && dimensionsCheck(rx, ry, mx, my, mxf, myf)){
            return true;
        }
    }
    return false;
}

SpaceGame.prototype.testText = function(){
    this.actions.dtext = 'test';
}

SpaceGame.prototype.nullText = function(){
    this.actions.dtext = undefined;
}