/*SpaceJects are used to describe any objects that float around in the 
battlefield, a mix of Space and Object. Cleverinorite. */

var SpaceJect = function(config){
		this.typeName = "SpaceJect";
		this.img = new Image();
		this.img.src = 'images/ships.gif'
		this.isDrawn = false;
	if(config !== undefined){ //most of this is gotten from not texthandler
		this.gridXLocation = config.gridXLocation;
		this.gridYLocation = config.gridYLocation;
		this.cscale = config.scale;
		this.statusKey = config.statusKey; // gotten from texthandler
		this.sqLength = config.sqLength;
		this.dimensions = this.createDimensions();
	}
}

SpaceJect.prototype.draw = function(scaledPage, x, y, sqLength){
	this.dimensions = scaledPage.spaceShip(x, y, this.img, sqLength);
}

SpaceJect.prototype.createDimensions = function(){
	var x, y, w, l, dimensions;
	x = this.gridXLocation*this.cscale;
	y = this.gridYLocation*this.cscale;
	w = this.sqLength*this.cscale;
	l = this.sqLength*this.cscale;
	dimensions = {'dx' : x, 'dy' : y, 'xLength' : w, 'yLength' : l};
	return dimensions;
}
