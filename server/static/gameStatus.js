var gameStatus = function(statusType, battlefield){
	this.statusType = statusType;
	this.battlefield = battlefield;
	this.initStatus();
}

gameStatus.prototype.initStatus = function(){
	if (this.statusType !== "Don't do stuff"){
		this.initFieldView();
	}
}

gameStatus.prototype.initFieldView = function(){
	this.createClickables(this.battlefield.spacejectList, [], 'shipView');

}

gameStatus.prototype.createClickables = function(spacejects, buttons,
	SPEH){ //SPEH = spaceject extra handler
	var newClick;
	var clickables = [];
	var i;
	var statusKey;
	for(i=0; i<spacejects.length;i++){
		newClick = new Clickable(spacejects[i], SPEH);

		clickables.push(newClick);
	}
	this.clickables = clickables;
}