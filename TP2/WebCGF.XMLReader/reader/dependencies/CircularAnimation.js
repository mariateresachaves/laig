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
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(elapsedTime)
{
	mat4.identity(this.translationMatrix);
	mat4.identity(this.rotationMatrix);

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

	mat4.translate(this.rotationMatrix, this.rotationMatrix, [this.centerX, this.centerY, this.centerZ]);
	
	mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this.startang + this.rotang * k);
	mat4.translate(this.rotationMatrix, this.rotationMatrix, [-this.radius, 0, 0]);
	if (this.rotang < 0)
		mat4.rotateY(this.rotationMatrix, this.rotationMatrix, Math.PI/180);
	
	return remainingTime;
};

CircularAnimation.prototype.getTranslationMatrix = function()
{
	return Animation.prototype.getTranslationMatrix.call(this);
}

CircularAnimation.prototype.getRotationMatrix = function()
{
	return Animation.prototype.getRotationMatrix.call(this);
};