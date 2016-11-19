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
	
	this.initialized = false;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function()
{
	this.initialized = true;
};

CircularAnimation.prototype.update = function(currTime)
{
	if (!this.initialized) return;
	
	if (this.startTime == null)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000;
	mat4.identity(this.translationMatrix);
	mat4.identity(this.rotationMatrix);

	var k = elapsedTime / this.span;
	if (k > 1) k = 1;

	mat4.translate(this.translationMatrix, this.translationMatrix, [this.centerX, this.centerY, this.centerZ]);
	
	mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this.startang + this.rotang * k);
	mat4.translate(this.rotationMatrix, this.rotationMatrix, [-this.radius, 0, 0]);
	if (this.rotang < 0)
		mat4.rotateY(this.rotationMatrix, this.rotationMatrix, Math.PI/180);	
};

CircularAnimation.prototype.getTranslationMatrix = function()
{
	return Animation.prototype.getTranslationMatrix.call(this);
}

CircularAnimation.prototype.getRotationMatrix = function()
{
	return Animation.prototype.getRotationMatrix.call(this);
};