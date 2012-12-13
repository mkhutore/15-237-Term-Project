var Clickable = function(clickedObject, SPEH){
	this.dimensions = clickedObject.dimensions;
	this.dimensions.dxf = this.dimensions.dx + this.dimensions.xLength;
	this.dimensions.dyf = this.dimensions.dy + this.dimensions.yLength;
	this.lIndex = clickedObject.lIndex;
	this.typeName = clickedObject.typeName;
	this.player = clickedObject.player;
	if (clickedObject.altImgurl === undefined){
		this.altColor = clickedObject.altColor;
	}
	else{
		this.altImgurl = clickedObject.altImgurl;
	}
	if(clickedObject.statusKey === undefined){
		this.statusKey = SPEH;
	}
	else{
		this.statusKey = clickedObject.statusKey;
	}
	this.changeKey = clickedObject.changeKey;
}

Clickable.prototype.clickCheck = function(cx, cy){
	if (this.withinX(cx) && this.withinY(cy)){
		return true;
	}
	else{
		return false;
	}
}

Clickable.prototype.withinX = function(cx){
	var dx = this.dimensions.dx;
	var dxf = this.dimensions.dxf;
	if((dx < cx) && (dxf > cx)){
		return true;
	}
	else{
		return false;
	}
}

Clickable.prototype.withinY = function(cy){
	var dy = this.dimensions.dy;
	var dyf = this.dimensions.dyf;
	if((dy < cy) && (dyf > cy)){
		return true;
	}
	else{
		return false;
	}
}