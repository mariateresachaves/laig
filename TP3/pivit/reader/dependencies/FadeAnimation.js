var degToRad = Math.PI / 180;

function FadeAnimation(scene, span, startTile, endTile) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.startTile = startTile;
	this.endTile = endTile;
};

FadeAnimation.prototype = Object.create(Animation.prototype);
FadeAnimation.prototype.constructor = FadeAnimation;

FadeAnimation.prototype.update = function(currTime)
{
	if (!this.startTime)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000
	var piece = this.startTile.piece;
	
	if (elapsedTime > this.span)
	{	
		this.startTile.piece = null;
		this.endTile.piece = piece;
		
		piece.tile = this.endTile;
		piece.animationX = 0;
		piece.animationY = 0;
		piece.animationZ = 0;
		piece.animationYAngle = 0;
		
		this.ended = true;
	}
	else
	{

	}
};