function GameMove(scene, player, piece, srcTile, destTile, capture, promotion, animations)
{
  this.player = player;
  this.piece = piece;
  this.srcTile = srcTile;
  this.destTile = destTile;
  this.capture = capture;
  this.promotion = promotion;
  this.animations = animations;
}

GameMove.prototype = Object.create(Object.prototype);
GameMove.prototype.constructor = GameMove;

GameMove.prototype.undo = function()
{
	if(this.promotion)
		this.piece.type = 'minion';

	this.srcTile.piece = this.piece;
	this.piece.tile = this.srcTile;
	this.piece.changeOrientation();

	//capture
	if(this.capture) {
		this.capture.tile.piece = null;
		this.capture.tile = this.destTile;
		this.destTile.piece = this.capture;
	}
	else {
		this.destTile.piece = null;
	}
}
