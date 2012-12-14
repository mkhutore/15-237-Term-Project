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

function whiteSpaceCheck(string){
	len = string.length;
	if(string.charCodeAt(len-1) === 13){
		return string.slice(0,len-1);
	}
	else{
		return string;
	}
}

function pathComparison(string1, string2){
    var diff, len1, len2;
    string1 = whiteSpaceCheck(string1);
    string2 = whiteSpaceCheck(string2);
	if(string1 === string2){
		return true;
	}
	else if(string2.length > string1.length){
		return pathComparison(string2, string1);
	}
	else{
		len1 = string1.length;
		len2 = string2.length;
		diff = len1 - len2;
		newString1 = string1.slice(diff,len1);
        return(newString1 === string2);
	}
}

function testpathComparison(string1, string2){
    var diff, len1, len2;
	if(string1 === string2){
		return true;
	}
	else if(string2.length > string1.length){
		return pathComparison(string2, string1);
	}
	else{
		len1 = string1.length;
		len2 = string2.length;
		diff = len1 - len2;
		newString1 = string1.slice(diff,len1);
        return(newString1);
	}
}