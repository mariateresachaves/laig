/**
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(scene, span)
{
	//call Animation constructor
	Animation.call(this, scene, span);
	this.controlPoints = [];
	
	this.initialized = false;
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.addControlPoint = function(controlPoint)
{
	this.controlPoints.push(controlPoint);
};

LinearAnimation.prototype.init = function()
{
	var totalDelta = 0;
	this.segments = [];
	
	for (i = 1; i < this.controlPoints.length; i++)
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
			
			//if (segment.deltay > 0)
			//	segment.angleZY = -Math.PI/2;
			//else if (segment.deltay < 0)
			//	segment.angleZY = Math.PI/2;
			//else segment.angleZY = 0;
		}
		else{
			segment.angleZX = Math.atan(segment.deltax / segment.deltaz );
			//segment.angleZY = Math.atan(-segment.deltay / segment.deltaz );
		}
		
		this.segments.push(segment);
		
		totalDelta += segment.delta;
	}
	
	for(i in this.segments)
	{
		var segment = this.segments[i];
		segment.span = this.span * segment.delta / totalDelta;		
	}
	
	this.initialized = true;
};

LinearAnimation.prototype.update = function(currTime)
{	
	if (!this.initialized) return;
	
	if (this.startTime == null)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000;
	mat4.identity(this.translationMatrix);
	mat4.identity(this.rotationMatrix);
	
	for(i in this.segments)
	{
		if (elapsedTime <= 0)
			break;
		
		var segment = this.segments[i];
		if (elapsedTime >= segment.span)
		{
			mat4.translate(this.translationMatrix, this.translationMatrix, [segment.deltax, segment.deltay, segment.deltaz]);
			if (i == this.segments.length - 1)
				mat4.rotateY(this.rotationMatrix, this.rotationMatrix, segment.angleZX);
		}
		else{
			var k = elapsedTime / segment.span;
			mat4.translate(this.translationMatrix, this.translationMatrix, [segment.deltax * k, segment.deltay * k, segment.deltaz * k]);
			mat4.rotateY(this.rotationMatrix, this.rotationMatrix, segment.angleZX);
		}		
		
		elapsedTime -= segment.span;
	}	
};

LinearAnimation.prototype.getTranslationMatrix = function()
{
	return Animation.prototype.getTranslationMatrix.call(this);
}

CircularAnimation.prototype.getRotationMatrix = function()
{
	return Animation.prototype.getRotationMatrix.call(this);
};