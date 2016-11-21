/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, span, centerX, centerY, centerZ, radius, startang, rotang) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.centerX = centerX;
	this.centerY = centerY;
	this.centerZ = centerZ;
	this.radius = radius; 
	this.startang = startang * Math.PI/180;
	this.rotang = rotang * Math.PI/180;
	
	this.pos.x = this.centerX + this.radius * Math.cos(this.startang);
	this.pos.y = this.centerY;
	this.pos.z = this.centerZ + this.radius * Math.sin(this.startang);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(elapsedTime)
{
	var k = 0;
	var remainingTime = 0;
	if (elapsedTime > this.span){
		k = 1;
		remainingTime = elapsedTime - this.span;
		this.ended = true;
	}
	else{
		var k = elapsedTime / this.span;
		remainingTime = 0;
	}

	this.pos.x = this.centerX + this.radius * Math.cos(this.startang + k * this.rotang);
	this.pos.y = this.centerY;
	this.pos.z = this.centerZ + this.radius * Math.sin(this.startang + k * this.rotang);

	this.orientation = this.startang + k * this.rotang;
	
	return remainingTime;
};