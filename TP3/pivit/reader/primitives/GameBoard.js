function GameBoard(scene, game) {
    Board.call(this, scene, game);
	
	this.pieceRadius = 0.4;
	this.pieceHeight = 0.1;
	this.tileSize = 1;

	//create tiles
	var isWhite = false;
	for(var i = 0; i < 8; i++)
	{
		this.tiles[i] = new Object;
		for(var j = 0; j < 8; j++)
		{
			if (isWhite){
				var color1 = vec4.fromValues(0.9, 0.9, 0.9, 1);
				var color2 = vec4.fromValues(1, 0, 0, 1);
				var color3 = vec4.fromValues(1, 1, 0, 1);
				isWhite = false;
			}
			else{
				var color1 = vec4.fromValues(0, 0, 0, 1);
				var color2 = vec4.fromValues(0.6, 0, 0, 1);
				var color3 = vec4.fromValues(0.6, 0.6, 0, 1);
				isWhite = true;
			}
			this.tiles[i][j] = new Tile(this.scene, this, this.tileSize, this.tileSize, i, j, color1, color2, color3);			
		}
		isWhite = !isWhite;
	}
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.createPieces = function(startingBoard)
{
	for(var i = 0; i < startingBoard.length; i++)
	{
		for(var j = 0; j < startingBoard[i].length; j++)
		{
			var tile = this.tiles[i][j];
			var tileInfo = startingBoard[i][j];
			if (tileInfo.length != 0)
				tile.piece = new Piece( this.scene, this.pieceRadius, this.pieceHeight,	'minion' + tileInfo[0], 'master' + tileInfo[0], tileInfo[0], tile, tileInfo[2] );			
		}
	}
}

GameBoard.prototype.getTile = function(rowNumber, columnLetter)
{
	var row = 8 - rowNumber; 
	var col = columnLetter.charCodeAt(0) - 97;
	return this.tiles[row][col];
}

GameBoard.prototype.getDestinationTile = function(rowNumber, columnLetter, orientation, numMoves)
{
	var row = 8 - rowNumber; 
	var col = columnLetter.charCodeAt(0) - 97;
	if (orientation == 'v')
		row -= numMoves;
	else
		col += numMoves;
	return this.tiles[row][col];
}

GameBoard.prototype.unselectAllTiles = function()
{
	for(row in this.tiles)
	{
		for(column in this.tiles[row])
		{
			var tile = this.tiles[row][column];
			tile.isSelected = false;
			tile.isValidMove = false;
		}
	}
}

/**
 * GameBoard display function.
 */
GameBoard.prototype.display = function()
{
	this.scene.pushMatrix();
	this.scene.translate(-4 * this.tileSize, 0, 4 * this.tileSize);

	var i = 1;
	for(row in this.tiles) {
		for(column in this.tiles[row]) {
			this.scene.registerForPick(i, this.tiles[row][column]);
			i++;
			if (this.tiles[row][column].piece){
				this.scene.registerForPick(i, this.tiles[row][column].piece);
				i++;
			}
			this.tiles[row][column].display();
		}
	}
	
	this.scene.popMatrix();
}
