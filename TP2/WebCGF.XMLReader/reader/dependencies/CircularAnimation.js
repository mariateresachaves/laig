var degToRad = Math.PI / 180;

/**
 * CircularAnimation
 * @param span animation's duration.
 * @param centerX center x position.
 * @param centerY center y position.
 * @param centerZ center z position.
 * @param radius radius.
 * @param startang start angle.
 * @param rotang angle of rotation.
 * @constructor
 */
function CircularAnimation(scene, span, centerX, centerY, centerZ, radius, startang, rotang) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.centerX = centerX;
	this.centerY = centerY;
	this.centerZ = centerZ;
	this.radius = radius; 
	this.startang = startang * degToRad;
	this.rotang = rotang * degToRad;
	
	this.pos.x = this.centerX + this.radius * Math.cos(this.startang);
	this.pos.y = this.centerY;
	this.pos.z = this.centerZ + this.radius * Math.sin(this.startang);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;


/**
 * Updates postion (x, y, z) for a given elapsed time.
 * @param elapsedTime elapsed time.
 */
CircularAnimation.prototype.update = function(elapsedTime) {
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