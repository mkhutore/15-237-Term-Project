/*SpaceJects are used to describe any objects that float around in the 
battlefield, a mix of Space and Object. Cleverinorite. */

var SpaceJect = function(config){
	this.typeName = "SpaceJect";
	this.img = new Image();
	this.img.src = 'ships.gif'

}

SpaceJect.prototype.draw = function(scaledPage, x, y){
	scaledPage.spaceShip(x, y, this.img);
}