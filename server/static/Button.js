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
	this.bImg = new Image();
	if(config.bImgurl !== undefined){
		this.imageStatus = true;
		this.bImgurl = config.bImgurl;
		this.bImg.src = this.bImgurl;
		this.altImgurl = config.altImgurl;
	}
	else{
		this.bImgurl = '/images/button-disabled.png';
		this.bImg.src = '/images/button-disabled.png';
		this.altImgurl = '/images/button-disabled.png';
	}
	this.bColor = config.bColor;
	this.statusKey = config.statusKey;
	this.changeKey = config.changeKey;
}