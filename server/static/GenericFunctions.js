function copyArray(list){
	newList = [];
	for(i=0;i<list.length;i++){
		newList.push(list[i]);
	}
	return newList;
}

function dimensionsCheck(cx, cy, sx, sy, sW, sH){
	if (withinDims(cx, sx, sW) && withinDims(cy, sy, sH)){
		return true;
	}
}

function withinDims(point, start, end){
	if((start < point) && (end > point)){
		return true;
	}
	else{
		return false;
	}
}