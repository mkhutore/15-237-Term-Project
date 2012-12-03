var Clickable = function(clickedObject, SPEH){
	this.dimensions = clickedObject.dimensions;
	this.dimensions.dxf = this.dimensions.dx + this.dimensions.xLength;
	this.dimensions.dyf = this.dimensions.dy + this.dimensions.yLength;
	this.typeName = clickedObject.typeName;
	if(clickedObject.toStatus === undefined){
		this.toStatus = SPEH;
	}
	else{
		this.toStatus = clickedObject.toStatus;
	}
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