function AuxiliaryBoard(scene, game, nPlayers) {
    Board.call(this, scene, game);
	
	this.tileSize = 1;

	//create tiles
	var color = vec4.fromValues(0.9, 0.9, 0.9, 1);
	
	var isWhite = false;
	for(var i = 0; i < nPlayers; i++)
	{
		this.tiles[i] = new Tile(this.scene, this, this.tileSize, this.tileSize, i, 0, 'whitetile', 'whitetile', 'whitetile');
	}
}

AuxiliaryBoard.prototype = Object.create(Board.prototype);
AuxiliaryBoard.prototype.constructor = AuxiliaryBoard;

AuxiliaryBoard.prototype.getTile = function(rowNumber, columnLetter)
{
	var row = 8 - rowNumber; 
	var col = columnLetter.charCodeAt(0) - 97;
	return this.tiles[row][col];
}

/**
 * AuxiliaryBoard display function.
 */
AuxiliaryBoard.prototype.display = function(texture)
{	
	for(row in this.tiles) {
		this.tiles[row].display(texture, false);
	}
}