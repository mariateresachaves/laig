function GameMove(scene, player, piece, srcTile, destTile, capturedPiece, promotion, animations)
{
  this.player = player;
  this.piece = piece;
  this.srcTile = srcTile;
  this.destTile = destTile;
  this.capturedPiece = capturedPiece;
  this.promotion = promotion;
  this.animations = animations;
}

GameMove.prototype = Object.create(Object.prototype);
GameMove.prototype.constructor = GameMove;

GameMove.prototype.undo = function()
{
	if(this.promotion)
		this.piece.type = 'minion';

	this.srcTile.addPiece(this.piece);
	this.destTile.removeTopPiece();
	this.piece.changeOrientation();

	//capture
	if(this.capturedPiece) {
		this.capturedPiece.tile.removeTopPiece();
		this.destTile.addPiece(this.capturedPiece);
	}
}
