/*SpaceJects are used to describe any objects that float around in the 
battlefield, a mix of Space and Object. Cleverinorite. */

var SpaceJect = function(config){
		this.typeName = "SpaceJect";
		this.img = new Image();
		this.img.src = 'images/ships.gif'
		//console.log('config=', config, 'width=', this.img.width);
		this.isDrawn = false;
	if(config !== undefined){
		this.gridXLocation = config.gridXLocation;
		this.gridYLocation = config.gridYLocation;
	}
}

SpaceJect.prototype.draw = function(scaledPage, x, y, sqLength){
	this.dimensions = scaledPage.spaceShip(x, y, this.img, sqLength);
}
