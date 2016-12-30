
function GameBoard(scene, playerTypes) {
    Board.call(this, scene);

    this.scene = scene;
	
	this.players;
	this.currentPlayer = 1;
	
	this.pieceRadius = 0.5;
	this.pieceHeight = 0.1;
	this.tileSize = 1;

	this.tiles = new Object;
	this.boardHistory = [];
	this.canSelect = false;
	this.firstTileSelection;
	
	//create tiles
	var isWhite = false;
	for(var i = 0; i < 8; i++)
	{
		this.tiles[i] = new Object;
		for(var j = 0; j < 8; j++)
		{
			if (isWhite){
				var color = vec4.fromValues(1, 1, 1, 1);
				isWhite = false;
			}
			else{
				var color = vec4.fromValues(0, 0, 0, 1);
				isWhite = true;
			}
			this.tiles[i][j] = new Tile(this.scene, this, this.tileSize, this.tileSize, i, j, color, vec4.fromValues(1, 0, 0, 1), vec4.fromValues(0, 1, 0, 1));			
		}
		isWhite = !isWhite;
	}
	
	this.requestNewGame(playerTypes);
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.requestNewGame = function (playerTypes)
{
	requestString = 'newgame(' + playerTypes.length + ',[' + playerTypes + '])';
	getPrologRequest(requestString, this.newGameHandler.bind(this));
}

GameBoard.prototype.newGameHandler = function(data)
{
	var res = data.target.response;
				
	res = res.replace(new RegExp('computer', 'g'), '"computer"');
	res = res.replace(new RegExp('human', 'g'), '"human"');
	res = res.replace(new RegExp(',m,', 'g'), ',"m",');
	res = res.replace(new RegExp(',M,', 'g'), ',"M",');
	res = res.replace(new RegExp(',v', 'g'), ',"v"');
	res = res.replace(new RegExp(',h', 'g'), ',"h"');				
		
	var newArr = JSON.parse(res);
	
	this.players = newArr[0];				
	console.log("Players");
	for(var i = 0; i < this.players.length; i++){
		console.log("player " + (i + 1) + ": " + this.players[i][0] + ", " + this.players[i][1]);
	}
				
	var startingBoard = newArr[1];
	this.boardHistory.push(startingBoard);
	console.log('startingBoard (' + startingBoard.length + ', ' + startingBoard[i].length + '):\n' + JSON.stringify(startingBoard));	
	
	console.log("\nBoard");
	for(var i = 0; i < startingBoard.length; i++)
	{
		for(var j = 0; j < startingBoard[i].length; j++)
		{
			var tile = this.tiles[i][j];
			if (startingBoard[i][j].length != 0)
			{
				tile.piece = new Piece(
					this.scene,
					this.pieceRadius,
					this.pieceHeight,
					'minion' + startingBoard[i][j][0],
					'master' + startingBoard[i][j][0],
					startingBoard[i][j][0],
					tile,
					startingBoard[i][j][2]);
				console.log('Board[' + i + ', ' + j + ']: ' + startingBoard[i][j]);
			}
		}
	}
	
	this.checkGameOver();
}

GameBoard.prototype.checkGameOver = function ()
{
	requestString = 'game_over(' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ',' + JSON.stringify(this.players) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkGameOverHandler.bind(this));
}

GameBoard.prototype.checkGameOverHandler = function(data)
{
	var res = data.target.response;
	
	if (res != '[]'){
		
		alert('GAME OVER');
		//var newArr = JSON.parse(res);
	}
	else
		this.checkPlayerEliminated();
}

GameBoard.prototype.checkPlayerEliminated = function ()
{
	requestString = 'player_eliminated(' + (this.currentPlayer) + ',' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerEliminatedHandler.bind(this));
}

GameBoard.prototype.checkPlayerEliminatedHandler = function(data)
{
	var res = data.target.response;
	if (res == 'yes')
		this.nextPlayer();
	else
		this.checkPlayerHasValidMoves();	
}

GameBoard.prototype.checkPlayerHasValidMoves = function ()
{
	requestString = 'no_valid_moves(' + (this.currentPlayer) + ',' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerHasValidMovesHandler.bind(this));
}

GameBoard.prototype.checkPlayerHasValidMovesHandler = function(data)
{
	var res = data.target.response;
	if (res == 'yes')
		this.nextPlayer();
	else
		this.selectMove();
}

GameBoard.prototype.nextPlayer = function ()
{
	this.currentPlayer = this.currentPlayer % this.players.length + 1;
	this.CheckGameOver();
}

GameBoard.prototype.selectMove = function ()
{
	if (this.players[this.currentPlayer - 1][0] == 'computer')
	{
		alert("Computer's turn")		
	}
	else
		this.canSelect = true;		
}

GameBoard.prototype.tileSelection = function (tile)
{
	if (!this.canSelect)
		return;
	
	if(!this.firstTile)
	{
		if(tile.piece && tile.piece.owner == this.currentPlayer)
		{
			tile.isSelected = true;
			this.firstTile = tile;
			this.getPossibleMoves(tile);
		}			
	}
	else if(this.firstTile == tile)
	{
		this.unselectAllTiles();
		this.firstTile = null;
	}
	else
	{
		this.checkValidMove(this.firstTile, tile);
	}
}

GameBoard.prototype.getPossibleMoves = function (tile)
{
	var rowNumber = 8 - tile.row; 
	var columnLetter = String.fromCharCode(tile.col + 97);
	requestString = 'pieceValidMoves(' + (this.currentPlayer) + ',' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ',' + rowNumber +',' + columnLetter + ')'; 
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getPossibleMovesHandler.bind(this));
}

GameBoard.prototype.getPossibleMovesHandler = function(data)
{
	var res = data.target.response;
	console.log(res);
	
	res = res.replace(new RegExp(',a,', 'g'), ',"a",');
	res = res.replace(new RegExp(',b,', 'g'), ',"b",');
	res = res.replace(new RegExp(',c,', 'g'), ',"c",');
	res = res.replace(new RegExp(',d,', 'g'), ',"d",');
	res = res.replace(new RegExp(',e,', 'g'), ',"e",');
	res = res.replace(new RegExp(',f,', 'g'), ',"f",');
	res = res.replace(new RegExp(',g,', 'g'), ',"g",');
	res = res.replace(new RegExp(',h,', 'g'), ',"h",');

	var newArr = JSON.parse(res);

	var orientation = this.getTile(newArr[0][0], newArr[0][1]).piece.orientation;
	
	for(var i = 0; i < newArr.length; i++)
	{
		this.getDestinationTile(newArr[i][0], newArr[i][1], orientation, newArr[i][2]).isValidMove = true;		
	}
}

GameBoard.prototype.checkValidMove = function (sourceTile, destTile)
{
	if (sourceTile.row != destTile.row && sourceTile.col != destTile.col) return;
	
	var nMoves = 0;
	if (sourceTile.row != destTile.row)
		nMoves = sourceTile.row - destTile.row;
	else
		nMoves = destTile.col - sourceTile.col;
	
	var rowNumber = 8 - sourceTile.row; 
	var columnLetter = String.fromCharCode(sourceTile.col + 97);
	
	requestString = 'valid_move(' + (this.currentPlayer) + ',' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ',' + rowNumber +',' + columnLetter + ',' + nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkValidMoveHandler.bind(this));
}

GameBoard.prototype.checkValidMoveHandler = function(data)
{
	var res = data.target.response;
	if (res != 'no')
	{
		this.makeMove(this.firstTile, res)
	}		
}

GameBoard.prototype.makeMove = function (sourceTile, nMoves)
{
	var rowNumber = 8 - sourceTile.row; 
	var columnLetter = String.fromCharCode(sourceTile.col + 97);
	
	requestString = 'move(' + (this.currentPlayer) + ',' + JSON.stringify(this.players) + ',' + JSON.stringify(this.boardHistory[this.boardHistory.length - 1]) + ',' + rowNumber +',' + columnLetter + ',' + nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.makeMoveHandler.bind(this));
}

GameBoard.prototype.makeMoveHandler = function(data)
{
	var res = data.target.response;
	if (res != [])
	{
		res = res.replace(new RegExp('computer', 'g'), '"computer"');
		res = res.replace(new RegExp('human', 'g'), '"human"');
		res = res.replace(new RegExp(',m,', 'g'), ',"m",');
		res = res.replace(new RegExp(',M,', 'g'), ',"M",');
		res = res.replace(new RegExp(',v', 'g'), ',"v"');
		res = res.replace(new RegExp(',h', 'g'), ',"h"');				

		var newArr = JSON.parse(res);

		this.players = newArr[0];				
		console.log("Players");
		for(var i = 0; i < this.players.length; i++){
			console.log("player " + (i + 1) + ": " + this.players[i][0] + ", " + this.players[i][1]);
		}

		var startingBoard = newArr[1];
		this.boardHistory.push(startingBoard);
		console.log('startingBoard (' + startingBoard.length + ', ' + startingBoard[i].length + '):\n' + JSON.stringify(startingBoard));
	}		
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

/**
 * GameBoard display function.
 */
GameBoard.prototype.display = function()
{
	var i = 1;
	for(row in this.tiles) {
		for(column in this.tiles[row]) {
			this.scene.registerForPick(i, this.tiles[row][column]);
			i++;
			this.tiles[row][column].display();
		}
	}
}
