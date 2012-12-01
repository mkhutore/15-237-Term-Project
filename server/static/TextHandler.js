  var TextHandler = function(){
  }


  TextHandler.prototype.readSingleFile = function(file) {
    $.get('asdf.txt', this.textGet.bind(this));
  }

  TextHandler.prototype.textGet = function(e) {
  	this.gotText = e;
  	this.lines = e.split('\n');
  	this.show();
  }

  TextHandler.prototype.show = function() {
  	console.log(this.gotText);
  	console.log(this.lines);
  }

