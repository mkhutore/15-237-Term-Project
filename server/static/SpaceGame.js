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
    TouchHandler.init(this);
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
		this.initBattlefield(game.objects);
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

SpaceGame.prototype.initBattlefield = function(objects){
    this.battlefield = new Battlefield({'width':this.width,
     'height':this.height, 'spacejects':objects});
}

SpaceGame.prototype.initStatus = function(){
    this.currentStatus = new gameStatus('FieldView', this.battlefield);

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
    this.pointed = new Pointed({'x':0,'y':0,'handled':true, 'pointType':'None'});
    if(!window.util.isIOS() && !window.util.isAndroid())
        {
            $(this.canvas).bind('click', this.onClick.bind(this));
        }
    this.page = new ScaledPage(this.canvas, this.width);
}

SpaceGame.prototype.onClick = function(event){ //this.pointed calls the current pointed
    coorX = event.pageX - $(this.canvas).offset().left;
    coorY = event.pageY - $(this.canvas).offset().top;
    this.pointed = new Pointed({'x': coorX, 'y': coorY, 'handled' : false,
        'pointType' : 'click'});
    alert('Cursor at ' + event.pageX + ', ' + event.pageY + '\n Offset '
            + $(this.canvas).offset().left + ', ' + $(this.canvas).offset().top + '\n Pointed ='
            + this.pointed.x + ',' + this.pointed.y + ',' + this.pointed.handled);
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
		
	}
}

SpaceGame.prototype.clearPage = function(){
    this.page.drawBackground(this.backgroundImg, this.width,
     this.height);
}

SpaceGame.prototype.updateBattlefield = function(){
    if(this.pointed.handled === false){
        this.handlePointer();
    }
}

SpaceGame.prototype.handlePointer = function(){
    var clickables = this.currentStatus.clickables.slice(0);
    cx = this.pointed.x;
    cy = this.pointed.y;
    var unchanged = true;
    var i;
    for(i=0;i<clickables.length;i++){
        if (clickables[i].clickCheck(cx, cy)){
            var currentScale = this.page.scale;
            var statusType = clickables[i].toStatus;
            this.battlefield.createShip(0, 0, currentScale);
            this.currentStatus = new gameStatus(statusType,
                this.battlefield); 
            unchanged = false;
        }
    }
    console.log(this.currentStatus.clickables);
    if(unchanged === true){
        this.currentStatus = new gameStatus('FieldView', this.battlefield);
    }
    this.pointed.handled = true;
}