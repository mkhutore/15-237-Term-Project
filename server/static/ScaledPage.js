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

ScaledPage.prototype.lineRect = function(x, y, width, height){
    this.page.strokeRect(x*this.scale, y*this.scale, width*this.scale,
                             height*this.scale);
}

ScaledPage.prototype.fillRect = function(x, y, width, height, style){
    this.page.fillStyle = style;
    this.page.fillRect(x * this.scale, y * this.scale, width * this.scale, height*this.scale);
}

ScaledPage.prototype.fillCircle = function(x, y, radius, style){
    this.page.fillStyle = style;
    this.page.beginPath();
    this.page.arc(x * this.scale, y * this.scale, radius * this.scale, 0, Math.PI*2, true);
    this.page.closePath();
    this.page.fill();
}

ScaledPage.prototype.spaceShip = function(x, y, img, sqLength){
    var sx = 4;
    var sy = 4;
    var sWidth = 58;
    var sHeight = 58;
    var dHeight = 32*this.scale;
    var dWidth = 32*this.scale;
    var dx = (x*this.scale);
    var dy = (y*this.scale);
    //this.page.drawImage(img, dx, dy);
    sqLength = sqLength * this.scale
    this.page.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    return {'dx':dx, 'dy': dy, 'xLength': sqLength, 'yLength': sqLength};
}