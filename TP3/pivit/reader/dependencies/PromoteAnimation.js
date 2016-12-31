var degToRad = Math.PI / 180;

function PromoteAnimation(scene, span, piece) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.piece = piece;
};

PromoteAnimation.prototype = Object.create(Animation.prototype);
PromoteAnimation.prototype.constructor = PromoteAnimation;

PromoteAnimation.prototype.update = function(currTime)
{
	if (this.startTime == null)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000
	
	if (elapsedTime > this.span)
	{		
		this.piece.animationY = 0;
		this.piece.animationXAngle = 0;
		this.piece.type = 'master';
	
		this.ended = true;
	}
	else
	{
		this.piece.animationXAngle = Math.PI * (elapsedTime / this.span);
		this.piece.animationY = Math.sin(this.piece.animationXAngle) * this.piece.radius * 2 + this.piece.height;
	}
};