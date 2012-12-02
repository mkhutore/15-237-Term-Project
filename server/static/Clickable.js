var Clickable = function(clickedObject){
	this.dimensions = clickedObject.dimensions;
	this.dimensions.dxf = this.dimensions.dx + this.dimensions.xLength;
	this.dimensions.dyf = this.dimensions.dy + this.dimensions.yLength;
	this.typeName = clickedObject.typeName;
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
	dx = this.dimensions.dx;
	dxf = this.dimensions.dxf;
	console.log()
	if((dx < cx) && (dxf > cx)){
		return true;
	}
	else{
		return false;
	}
}

Clickable.prototype.withinY = function(cy){
	dy = this.dimensions.dy;
	dyf = this.dimensions.dyf;
	if((dy < cy) && (dyf > cy)){
		return true;
	}
	else{
		return false;
	}
}