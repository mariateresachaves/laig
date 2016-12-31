var degToRad = Math.PI / 180;

function JumpAnimation(scene, span, startTile, endTile) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.startTile = startTile;
	this.endTile = endTile;
	this.dist = Math.sqrt(Math.pow(endTile.x - startTile.x, 2) + Math.pow(endTile.z - startTile.z, 2)) / 2;
};

JumpAnimation.prototype = Object.create(Animation.prototype);
JumpAnimation.prototype.constructor = JumpAnimation;

JumpAnimation.prototype.update = function(currTime)
{
	if (this.startTime == null)
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
		piece.changeOrientation();
		
		this.ended = true;
	}
	else
	{
		piece.animationX = (this.endTile.x - this.startTile.x) * (elapsedTime / this.span);
		piece.animationY = this.dist * Math.sin( Math.acos( 1 - 2*(elapsedTime / this.span) ) );
		piece.animationZ = (this.endTile.z - this.startTile.z) * (elapsedTime / this.span);
		piece.animationYAngle = Math.PI/2 * (elapsedTime / this.span);
	}
};