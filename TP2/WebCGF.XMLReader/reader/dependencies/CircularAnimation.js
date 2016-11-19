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

CircularAnimation.prototype.init = function()
{
	//var totalDelta = 0;
	//this.segments = [];
	//
	//for (i = 1; i < this.controlPoints.length; i++)
	//{
	//	var segment = new Object;
	//	
	//	segment.deltax = this.controlPoints[i].x - this.controlPoints[i-1].x;
	//	segment.deltay = this.controlPoints[i].y - this.controlPoints[i-1].y;
	//	segment.deltaz = this.controlPoints[i].z - this.controlPoints[i-1].z;
	//	segment.delta += Math.sqrt( Math.pow(segment.deltax, 2) + Math.pow(segment.deltay, 2) + Math.pow(segment.deltaz, 2) );
	//	segment.angleZX = Math.atan(segment.deltax / segment.deltaz );
	//	segment.angleZY = Math.atan(segment.deltay / segment.deltaz );
	//	
	//	this.segments.push(segment);
	//	
	//	totalDelta += segment.delta;
	//}
	//
	//for(i in this.segments)
	//{
	//	var segment = this.segments[i];
	//	segment.span = this.span * segment.delta / totalDelta;		
	//}
	//
	//this.startTime = Date.now();
};

CircularAnimation.prototype.update = function(currTime)
{	
	//if (this.startTime == null) return;
	//
	//var elapsedTime = Date.now() - this.startTime;
	//mat4.identity(this.matrix);
	//
	//for(i in this.segments)
	//{
	//	if (elapsedTime <= 0)
	//		break;
	//	
	//	var segment = this.segments[i];
	//	if (elapsedTime >= segment.span)
	//	{
	//		mat4.translate(this.matrix, this.matrix, [segment.deltax, segment.deltay, segment.deltaz]);
	//	}
	//	else{
	//		var k = elapsedTime / segment.span;
	//		mat4.translate(this.matrix, this.matrix, [segment.deltax * k, segment.deltay * k, segment.deltaz * k]);
	//		mat4.rotateX(this.matrix, this.matrix, -segment.angleZY);
	//		mat4.rotateY(this.matrix, this.matrix, segment.angleZX);
	//	}		
	//	
	//	elapsedTime -= segment.span;
	//}	
};

CircularAnimation.prototype.getMatrix = function()
{
	return Animation.prototype.getMatrix.call(this);
}