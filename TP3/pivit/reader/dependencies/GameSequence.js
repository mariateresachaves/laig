function GameSequence(scene) {
	this.scene = scene;
	this.moves = [];
}

GameSequence.prototype = Object.create(Object.prototype);
GameSequence.prototype.constructor = GameSequence;

GameSequence.prototype.addMove = function(piece, srcTile, destTile, capture, promotion, animations)
{
	var move = new GameMove(this.scene, piece, srcTile, destTile, capture, promotion, animations);
	this.moves.push(move);
}

GameSequence.prototype.undo = function()
{
	if (this.moves.length > 0)
	{
		this.moves[this.moves.length - 1].undo();
		this.moves.pop();
	}
}

GameSequence.prototype.replay = function()
{
	for (var i = this.moves.length - 1; i >= 0; i--)
	{
		this.moves[i].undo();
	}
	var animations = []
	for (var i = 0; i < this.moves.length; i++)
	{
		animations = animations.concat(this.moves[i].animations);
	}
	this.scene.game.animations = animations;
}
