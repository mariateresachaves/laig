/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, span, centerx, centery, centerz, radius, startang, rotang) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius; 
	this.startang = startang;
	this.rotang = rotang;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;