//THE BUTTON FILE YAY

var gameButton = function(config, scale, lIndex){
	var displayType, dTLen;
	this.buttonName = config.buttonName;
	this.dx = config.dx;
	this.dy = config.dy;
	this.lIndex = lIndex;
	this.bWidth = config.bWidth;
	this.bHeight = config.bHeight;
	this.clickChange = false; //for animations
	this.dimensions = {'dx':this.dx*scale,'dy':this.dy*scale,
	'xLength':this.bWidth*scale, 'yLength':this.bHeight*scale};
	this.typeName = 'button';
	this.altColor = config.altColor;
	this.displayText = config.displayText;
	this.img = new Image();
	this.img.src = '/images/Ships.gif';
	this.bColor = config.bColor;
	this.statusKey = config.statusKey;
	this.changeKey = config.changeKey;
}