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
    //Mousehandler.init(this);
    this.initBall();
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


SpaceGame.prototype.onClick = function(event){
    coorX = event.pageX - $(this.canvas).offset().left;
    coorY = event.pageY - $(this.canvas).offset().top;
    this.pointed = new Pointed({'x': coorX, 'y': coorY, 'handled' : false});
    console.log(this.pointed);
    alert('Cursor at ' + event.pageX + ', ' + event.pageY + '\n Offset '
            + $(this.canvas).offset().left + ', ' + $(this.canvas).offset().top + '\n Pointed ='
            + this.pointed.x + ',' + this.pointed.y + ',' + this.pointed.handled);
}

SpaceGame.prototype.initBattlefield = function(){
    this.battlefield = new Battlefield({'width':this.width,
     'height':this.height});
}

SpaceGame.prototype.initBall = function(){
    this.ball = new Ball({'x': this.width/2, 'y': this.height/2,
                            'radius': 20,
                            'maxX': this.width, 'maxY': this.height});
    this.ball.velx = 5;
    this.ball.vely = 5;
}

SpaceGame.prototype.initAccelerometer = function(){
    this.accelerometer = new Accelerometer();
    this.accelerometer.startListening();
}

//==============================================
//DRAWING
//==============================================

SpaceGame.prototype.draw = function(timeDiff){
    this.clearPage();
    this.drawBall(timeDiff);
    TouchHandler.drawBalls(timeDiff);
    this.updateBall();
    this.battlefield.draw(this.page);
    console.log(this.pointed);
}

SpaceGame.prototype.clearPage = function(){
    this.page.drawBackground(this.backgroundImg, this.width, this.height);
}

SpaceGame.prototype.drawBall = function(timeDiff){
    //this.ball.update(timeDiff);
    //this.ball.draw(this.page);
}

SpaceGame.prototype.updateBall = function(){
    var lastAcceleration = this.accelerometer.getLast();
    this.ball.velx += lastAcceleration.x/8;
    this.ball.vely += lastAcceleration.y/8;

}
