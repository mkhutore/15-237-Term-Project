var gameStatus = function(statusType, battlefield){
	this.statusType = statusType;
	this.battlefield = battlefield;
	this.initStatus();
}

gameStatus.prototype.initStatus = function(){
	if (this.statusType === 'FieldView'){
		this.initFieldView();
	}
}

gameStatus.prototype.initFieldView = function(){
	this.createClickables(this.battlefield.spacejectList, []);

}

gameStatus.prototype.createClickables = function(spacejects, buttons){
	var newClick;
	var clickables = [];
	for(i=0; i<spacejects.length;i++){
		newClick = new Clickable(spacejects[i])
		clickables.push(newClick);
	}
	this.clickables = clickables;
}