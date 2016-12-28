function GameMove(scene, piece, src_tile, dest_tile) {
  CGFobject.call(this,scene);

  this.piece = piece;
  this.src_tile = src_tile;
  this.dest_tile = dest_tile;
}

GameMove.prototype = Object.create(CGFobject.prototype);
GameMove.prototype.constructor = GameMove;
