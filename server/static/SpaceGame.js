var SpaceGame = function(){
    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.draw.bind(this));
}

//==============================================
//SETUP
//==============================================

SpaceGame.prototype.setup = function(){
    window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
    this.initCanvas();
    TouchHandler.init(this);
    this.initStatus();
    this.initTextHandler();
    this.initAccelerometer();
    this.initBattlefield();
}

SpaceGame.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = 480;
    this.height = 320;
    this.backgroundImg = new Image();
    this.backgroundImg.src = 'images/Space_bg2.gif';
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    this.pointed = new Pointed({'x':0,'y':0,'handled':true});
    $(this.canvas).bind('click', this.onClick.bind(this));
    this.page = new ScaledPage(this.canvas, this.width);
}

SpaceGame.prototype.onClick = function(event){ //this.pointed calls the current pointed
    coorX = event.pageX - $(this.canvas).offset().left;
    coorY = event.pageY - $(this.canvas).offset().top;
    this.pointed = new Pointed({'x': coorX, 'y': coorY, 'handled' : false});
    this.TextHandler.readSingleFile();
    console.log(this.pointed);
    alert('Cursor at ' + event.pageX + ', ' + event.pageY + '\n Offset '
            + $(this.canvas).offset().left + ', ' + $(this.canvas).offset().top + '\n Pointed ='
            + this.pointed.x + ',' + this.pointed.y + ',' + this.pointed.handled);
}

SpaceGame.prototype.initStatus = function(){
}
SpaceGame.prototype.initBattlefield = function(){
    this.battlefield = new Battlefield({'width':this.width,
     'height':this.height});
}

SpaceGame.prototype.initAccelerometer = function(){
    this.accelerometer = new Accelerometer();
    this.accelerometer.startListening();
}

SpaceGame.prototype.initTextHandler = function(){
    this.TextHandler = new TextHandler();
}


//==============================================
//DRAWING
//==============================================

SpaceGame.prototype.draw = function(timeDiff){
    this.clearPage();
    this.updateBattlefield();
    this.battlefield.draw(this.page);
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

}