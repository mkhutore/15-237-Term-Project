ScaledPage = function(canvas, virtualWidth){
    this.canvas = canvas;
    this.page = this.canvas[0].getContext('2d');
    this.scale = this.canvas.width() / virtualWidth;
    this.testVal = 1;
}

ScaledPage.prototype.pageToCanvas = function(pageX, pageY) {
    var offset = this.canvas.offset();
    var x = (pageX - offset.left)  / this.scale;
    var y = (pageY - offset.top)   / this.scale;
    return { 'x': x,
             'y': y
           };
}

ScaledPage.prototype.canvasToPage = function(canvasX, canvasY) {
    // Note: converting to page does not take into account the offset of
    // the canvas because when you draw at the returned location it will
    // automatically be offset by that amount.
    return { 'x': canvasX * this.scale,
             'y': canvasY * this.scale
           };
}

ScaledPage.prototype.drawBackground = function(img, width, height){
    this.page.drawImage(img, 0, 0, width*this.scale, height*this.scale);
}

ScaledPage.prototype.drawStatus = function(status){ //this is a test function!
    this.page.font = "60px Arial";
    this.page.textAlign = "center";
    this.page.fillStyle = "white";
    this.page.fillText(status, this.canvas.width()/2, 100);

}

ScaledPage.prototype.drawDtext = function(status){ //this is a test function!
    this.page.font = "30px Arial";
    this.page.textAlign = "center";
    this.page.fillStyle = "yellow";
    this.page.fillText(status, this.canvas.width()/2, 100);

}

ScaledPage.prototype.drawStatText = function(status, x, y, align, font){
    if(font !== undefined){
        this.page.font = font;
    }
    else{
        this.page.font = (10*this.scale).toString() + "px Arial";
    }
    this.page.textAlign = align;
    if(x > (this.canvas.width() / this.scale)){
        console.log('asdf');
    }
    this.page.fillStyle = "white";
    this.page.fillText(status, x*this.scale, y*this.scale);
    if(this.testVal > 0){
        this.testVal--;
        //console.log("SHOULDWORK");
    }
}

ScaledPage.prototype.drawButtonText = function(x, y, width, height, text){
    var font, fontSize, textX, textY;
    fontSize = (((width + height)/2) * this.scale)/5;
    font = fontSize.toString() + 'px Arial';
    this.page.font = font;
    this.page.textAlign = "center";
    this.page.fillStyle = "black";
    textX = ((2 * x) + width) / 2;
    textY = ((1.5 * y) + height) / 1.5;
    this.page.fillText(text, textX*this.scale, textY*this.scale);
}

ScaledPage.prototype.drawButtonImg = function(x, y, w, h, img){
    scale = this.scale;
    this.page.drawImage(img, x*scale, y*scale, w*scale, h*scale);
}

ScaledPage.prototype.lineRect = function(x, y, width, height){
    this.page.strokeRect(x*this.scale, y*this.scale, width*this.scale,
                             height*this.scale);
}

ScaledPage.prototype.fillRect = function(x, y, width, height, style){
    this.page.fillStyle = style;
    //console.log(width,height,style);
    this.page.fillRect(x * this.scale, y * this.scale, width * this.scale, height*this.scale);
    //console.log("fillrectend");
}

ScaledPage.prototype.fillCircle = function(x, y, radius, style){
    this.page.fillStyle = style;
    this.page.beginPath();
    this.page.arc(x * this.scale, y * this.scale, radius * this.scale, 0, Math.PI*2, true);
    this.page.closePath();
    this.page.fill();
}

ScaledPage.prototype.spaceShip = function(x, y, img, sqLength){
    //var sx = 4;
    //var sy = 4;
    //var sWidth = 58;
    //var sHeight = 58;
    var dHeight = sqLength*this.scale;
    var dWidth = sqLength*this.scale;
    var dx = (x*this.scale);
    var dy = (y*this.scale);
    //this.page.drawImage(img, dx, dy);
    var sqLength = sqLength * this.scale
    this.page.drawImage(img, dx, dy, dWidth, dHeight);
    return {'dx':dx, 'dy': dy, 'xLength': sqLength, 'yLength': sqLength};
}