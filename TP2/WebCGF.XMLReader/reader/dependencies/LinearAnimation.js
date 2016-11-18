/**
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(scene, span)
{
	//call Animation constructor
	Animation.call(this, scene, span);
	this.controlPoints = [];
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.addControlPoint = function(controlPoint)
{
	this.controlPoints.push(controlPoint);
};

LinearAnimation.prototype.init = function()
{
	this.delta = 0;
	this.segments = [];
	
	for (i = 0; i < this.controlPoints.length - 1; i++)
	{
		var segment = new Object;
		
		segment.deltax = this.controlPoints[i+1].x - this.controlPoints[i].x;
		segment.deltay = this.controlPoints[i+1].y - this.controlPoints[i].y;
		segment.deltaz = this.controlPoints[i+1].z - this.controlPoints[i].z;
		segment.delta += Math.sqrt( Math.pow(segment.deltax, 2) + Math.pow(segment.deltay, 2) + Math.pow(segment.deltaz, 2) );
		segment.angleZX = Math.atan(segment.deltax / segment.deltaz );
		segment.angleZY = Math.atan(segment.deltay / segment.deltaz );
		
		this.segments.push(segment);
		
		this.delta += segment.delta;
	}
	
	for(i in this.segments)
	{
		var segment = this.segments[i];
		segment.span = this.span * segment.delta / this.delta;		
	}
	
	this.startTime = Date.now();
};

LinearAnimation.prototype.update = function(currTime)
{
	if (this.startTime == null) return;
	
	var elapsedTime = Date.now() - this.startTime;
	var totalSpan = 0;
	
	for(i in this.segments)
	{
		var segment = this.segments[i];
		totalSpan += segment.span;
		if (elapsedTime < totalSpan)
			break;
		
		if (elapsedTime > totalSpan)
	}
	
	
};