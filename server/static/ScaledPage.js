ScaledPage = function(canvas, virtualWidth){
    this.canvas = canvas;
    this.page = this.canvas[0].getContext('2d');
    this.scale = this.canvas.width() / virtualWidth;
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
    var dHeight = 32*this.scale;
    var dWidth = 32*this.scale;
    var dx = (x*this.scale);
    var dy = (y*this.scale);
    //this.page.drawImage(img, dx, dy);
    var sqLength = sqLength * this.scale
    this.page.drawImage(img, dx, dy, dWidth, dHeight);
    return {'dx':dx, 'dy': dy, 'xLength': sqLength, 'yLength': sqLength};
}