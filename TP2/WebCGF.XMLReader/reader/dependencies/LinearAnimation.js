/**
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(scene, span, controlPoints)
{
	//call Animation constructor
	Animation.call(this, scene, span);
	this.controlPoints = controlPoints;
	
	var totalDelta = 0;
	this.segments = [];
	
	for (var i = 1; i < this.controlPoints.length; i++)
	{
		var segment = new Object;
		
		segment.deltax = this.controlPoints[i].x - this.controlPoints[i-1].x;
		segment.deltay = this.controlPoints[i].y - this.controlPoints[i-1].y;
		segment.deltaz = this.controlPoints[i].z - this.controlPoints[i-1].z;
		segment.delta = Math.sqrt( Math.pow(segment.deltax, 2) + Math.pow(segment.deltay, 2) + Math.pow(segment.deltaz, 2) );
		
		if (segment.deltaz == 0)
		{
			if (segment.deltax > 0)
				segment.angleZX = Math.PI/2;
			else if (segment.deltax < 0)
				segment.angleZX = -Math.PI/2;
			else segment.angleZX = 0;
		}
		else{
			segment.angleZX = Math.atan(segment.deltax / segment.deltaz );			
		}
		
		this.segments.push(segment);
		
		totalDelta += segment.delta;
	}
	
	for(i in this.segments)
	{
		var segment = this.segments[i];
		segment.span = this.span * segment.delta / totalDelta;		
	}
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(elapsedTime)
{	
	mat4.identity(this.translationMatrix);
	mat4.identity(this.rotationMatrix);
	
	var remainingTime = elapsedTime;
	
	for(i in this.segments)
	{
		if (remainingTime <= 0)
			break;
		
		var segment = this.segments[i];
		if (remainingTime >= segment.span)
		{
			mat4.translate(this.translationMatrix, this.translationMatrix, [segment.deltax, segment.deltay, segment.deltaz]);
			if (i == this.segments.length - 1)
				mat4.rotateY(this.rotationMatrix, this.rotationMatrix, segment.angleZX);
		}
		else{
			var k = remainingTime / segment.span;
			mat4.translate(this.translationMatrix, this.translationMatrix, [segment.deltax * k, segment.deltay * k, segment.deltaz * k]);
			mat4.rotateY(this.rotationMatrix, this.rotationMatrix, segment.angleZX);
		}		
		
		remainingTime -= segment.span;
	}
	
	if(remainingTime > 0)
		this.ended = true;
	
	return remainingTime;
};

LinearAnimation.prototype.getTranslationMatrix = function()
{
	return Animation.prototype.getTranslationMatrix.call(this);
}

CircularAnimation.prototype.getRotationMatrix = function()
{
	return Animation.prototype.getRotationMatrix.call(this);
};