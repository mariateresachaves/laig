var degToRad = Math.PI / 180;

function FadeAnimation(scene, span, startTile, endTile) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.startTile = startTile;
	this.endTile = endTile;
	this.piece = this.startTile.piece;
};

FadeAnimation.prototype = Object.create(Animation.prototype);
FadeAnimation.prototype.constructor = FadeAnimation;

FadeAnimation.prototype.update = function(currTime)
{
	if (!this.startTime)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000
	
	if (elapsedTime < this.span/2 )
	{
		this.piece.animationScale = 1 - (elapsedTime / (this.span/2) );

	}	
	else if (elapsedTime > this.span)
	{	
		this.startTile.piece = null;
		this.endTile.piece = this.piece;		
		this.piece.tile = this.endTile;
		this.piece.animationScale = 1;
		
		this.ended = true;
	}
	else
	{
		this.startTile.piece = null;
		this.endTile.piece = this.piece;		
		this.piece.tile = this.endTile;
		this.piece.animationScale = (elapsedTime / (this.span/2)) - 1;		
	}
};