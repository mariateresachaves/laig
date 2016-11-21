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
	
	this.startPos = new Object;
	this.startPos.x = this.controlPoints[0].x;
	this.startPos.y = this.controlPoints[0].y;
	this.startPos.z = this.controlPoints[0].z;
	
	for (var i = 1; i < this.controlPoints.length; i++)
	{
		var segment = new Object;
		
		segment.deltaX = this.controlPoints[i].x - this.controlPoints[i-1].x;
		segment.deltaY = this.controlPoints[i].y - this.controlPoints[i-1].y;
		segment.deltaZ = this.controlPoints[i].z - this.controlPoints[i-1].z;
		segment.delta = Math.sqrt( Math.pow(segment.deltaX, 2) + Math.pow(segment.deltaY, 2) + Math.pow(segment.deltaZ, 2) );
		
		if (segment.deltaZ == 0)
		{
			if (segment.deltaX > 0)
				segment.angleZX = Math.PI/2;
			else if (segment.deltaX < 0)
				segment.angleZX = -Math.PI/2;
			else segment.angleZX = 0;
		}
		else{
			segment.angleZX = Math.atan(segment.deltaX / segment.deltaZ );			
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
	var remainingTime = elapsedTime;
	
	this.pos.x = this.startPos.x;
	this.pos.y = this.startPos.y;
	this.pos.z = this.startPos.z;
	
	for(i in this.segments)
	{
		if (remainingTime <= 0)
			break;
		
		var segment = this.segments[i];
		if (remainingTime >= segment.span)
		{
			this.pos.x += segment.deltaX;
			this.pos.y += segment.deltaY;
			this.pos.z += segment.deltaZ;
		}
		else{
			var k = remainingTime / segment.span;
			
			this.pos.x += segment.deltaX * k;
			this.pos.y += segment.deltaY * k;
			this.pos.z += segment.deltaZ * k;
		}
		
		this.orientation = segment.angleZX;		
		remainingTime -= segment.span;
	}
	
	if(remainingTime > 0)
		this.ended = true;
	
	return remainingTime;
};