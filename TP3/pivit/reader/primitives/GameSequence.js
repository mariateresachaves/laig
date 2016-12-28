function GameSequence(scene) {
  CGFobject.call(this,scene);

  this.seq_moves = [];
}

GameSequence.prototype = Object.create(CGFobject.prototype);
GameSequence.prototype.constructor = GameSequence;

GameSequence.prototype.AddMove = function(piece, src_tile, dest_tile)
{
  var move = new GameMove(piece, src_tile, dest_tile);
	this.seq_moves.push(move);
}

GameSequence.prototype.Undo = function()
{
  if (this.seq_moves.length == 0)
  {
    console.log("No moves have been done yet.");
    return;
  }

  else
    this.seq_moves.pop();
}
