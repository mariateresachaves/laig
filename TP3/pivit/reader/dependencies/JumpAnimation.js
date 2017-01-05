var degToRad = Math.PI / 180;

function JumpAnimation(scene, span, startTile, endTile) {
	//call Animation constructor
	Animation.call(this, scene, span);
	this.startTile = startTile;
	this.endTile = endTile;
	this.piece = this.startTile.getTopPiece();
	this.arcLength = Math.sqrt(Math.pow(this.endTile.x - this.startTile.x, 2) + Math.pow(this.endTile.z - this.startTile.z, 2)) / 2;
};

JumpAnimation.prototype = Object.create(Animation.prototype);
JumpAnimation.prototype.constructor = JumpAnimation;

JumpAnimation.prototype.update = function(currTime)
{
	if (this.startTime == null)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000
	
	if (elapsedTime > this.span)
	{	
		this.startTile.removeTopPiece();
		this.endTile.addPiece(this.piece);
		
		this.piece.animationX = 0;
		this.piece.animationY = 0;
		this.piece.animationZ = 0;
		this.piece.animationYAngle = 0;
		this.piece.changeOrientation();
		
		this.ended = true;
	}
	else
	{
		var angleDelta =  Math.PI * (elapsedTime / this.span);
		//piece.animationX = (this.endTile.x - this.startTile.x) * (elapsedTime / this.span);
		this.piece.animationX = (this.endTile.x - this.startTile.x) * (1 - Math.cos(angleDelta) )/2;
		//piece.animationY = this.arcLength * Math.sin( Math.acos( 1 - 2*(elapsedTime / this.span) ) );
		this.piece.animationY = this.arcLength * Math.sin(angleDelta);
		//piece.animationZ = (this.endTile.z - this.startTile.z) * (elapsedTime / this.span);
		this.piece.animationZ = (this.endTile.z - this.startTile.z) * (1 - Math.cos(angleDelta) )/2;
		this.piece.animationYAngle = angleDelta/2;
	}
};