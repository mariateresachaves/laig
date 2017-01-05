var degToRad = Math.PI / 180;

function FadeAnimation(scene, span, startTile, endTile) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.startTile = startTile;
	this.endTile = endTile;
	this.piece = this.startTile.getTopPiece();
	this.pieceChangedTile = false;
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
		if (!this.pieceChangedTile)
		{
			this.pieceChangedTile = true;
			this.startTile.removeTopPiece();
			this.endTile.addPiece(this.piece);
		}
		
		this.piece.animationScale = 1;		
		this.ended = true;
	}
	else
	{
		if (!this.pieceChangedTile)
		{
			this.pieceChangedTile = true;
			this.startTile.removeTopPiece();
			this.endTile.addPiece(this.piece);
		}
		this.piece.animationScale = (elapsedTime / (this.span/2)) - 1;		
	}
};

FadeAnimation.prototype.reset = function() {
	Animation.prototype.reset.call(this);
	this.pieceChangedTile = false;
};