
function Game(scene, playerTypes) {

    this.scene = scene;
	
	this.nPlayers = playerTypes.length;
	this.players;
	this.currentPlayer = 0;	

	this.boardHistory = [];
	this.playersHistory = [];
	this.animations = [];
	this.replaying = false;
	
	this.canSelect = false;
	this.firstTile;
	this.secondTile;

	this.gameboard = new GameBoard(this.scene, this);	
	this.auxboard = new AuxiliaryBoard(this.scene, this, this.nPlayers);
	this.gameSequence = new GameSequence(this.scene);
	this.requestNewGame(playerTypes);
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

Game.prototype.requestNewGame = function (playerTypes)
{
	requestString = 'newgame(' + playerTypes.length + ',[' + playerTypes + '])';
	getPrologRequest(requestString, this.newGameHandler.bind(this));
}

Game.prototype.newGameHandler = function(data)
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
	this.playersHistory.push(this.players);				
				
	var startingBoard = newArr[1];
	this.boardHistory.push(startingBoard);
	//console.log('startingBoard (' + startingBoard.length + ', ' + startingBoard[0].length + '):\n' + JSON.stringify(startingBoard));	
	
	this.gameboard.createPieces(startingBoard);
	
	this.nextPlayer();
}

Game.prototype.checkGameOver = function ()
{
	var board = this.getCurrentBoardJSON();	
	requestString = 'game_over(' + board + ',' + JSON.stringify(this.players) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkGameOverHandler.bind(this));
}

Game.prototype.checkGameOverHandler = function(data)
{
	var res = data.target.response;
	
	if (res != '[]')
	{
		res = res.replace(new RegExp('First Master', 'g'), '"First Master"');
		res = res.replace(new RegExp('Last player standing', 'g'), '"Last player standing"');
		res = res.replace(new RegExp('Most Masters', 'g'), '"Most Masters"');
				
		var newArr = JSON.parse(res);
		alert('GAME OVER\nPlayer ' + newArr[0] + ' won (' + newArr[1] + ')');
		//var newArr = JSON.parse(res);
	}
	else
		this.checkPlayerEliminated();
}

Game.prototype.checkPlayerEliminated = function ()
{
	var board = this.getCurrentBoardJSON();	
	requestString = 'player_eliminated(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerEliminatedHandler.bind(this));
}

Game.prototype.checkPlayerEliminatedHandler = function(data)
{
	var res = data.target.response;
	if (res == 'yes')
		this.nextPlayer();
	else
		this.checkPlayerHasValidMoves();	
}

Game.prototype.checkPlayerHasValidMoves = function ()
{
	var board = this.getCurrentBoardJSON();	
	requestString = 'no_valid_moves(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerHasValidMovesHandler.bind(this));
}

Game.prototype.checkPlayerHasValidMovesHandler = function(data)
{
	var res = data.target.response;
	if (res == 'yes')
		this.nextPlayer();
	else
		this.selectMove();
}

Game.prototype.nextPlayer = function ()
{
	this.currentPlayer = this.currentPlayer % this.nPlayers + 1;
	this.checkGameOver();
}

Game.prototype.previousPlayer = function ()
{
	this.currentPlayer -= 1;
	if(this.currentPlayer == 0)
		this.currentPlayer = this.nPlayers;
	this.checkGameOver();
}

Game.prototype.selectMove = function ()
{
	if (this.players[this.currentPlayer - 1][0] == 'computer')
		this.getComputerMove();
	else
		this.canSelect = true;		
}

Game.prototype.getComputerMove = function (tile)
{
	var board = this.getCurrentBoardJSON();
	
	requestString = 'choose_move(' + (this.currentPlayer) + ',' + board + ')'; 
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getComputerMoveHandler.bind(this));
}

Game.prototype.getComputerMoveHandler = function(data)
{
	var res = data.target.response;
	
	res = res.replace(new RegExp(',a,', 'g'), ',"a",');
	res = res.replace(new RegExp(',b,', 'g'), ',"b",');
	res = res.replace(new RegExp(',c,', 'g'), ',"c",');
	res = res.replace(new RegExp(',d,', 'g'), ',"d",');
	res = res.replace(new RegExp(',e,', 'g'), ',"e",');
	res = res.replace(new RegExp(',f,', 'g'), ',"f",');
	res = res.replace(new RegExp(',g,', 'g'), ',"g",');
	res = res.replace(new RegExp(',h,', 'g'), ',"h",');

	var newArr = JSON.parse(res);
	var rowNumber = newArr[0];
	var columnLetter = newArr[1];
	var numMoves = newArr[2];
	
	this.firstTile = this.gameboard.getTile(rowNumber, columnLetter);
	var orientation = this.firstTile.piece.orientation;
	
	this.secondTile = this.gameboard.getDestinationTile(rowNumber, columnLetter, orientation, numMoves)
	this.makeMove(this.firstTile, numMoves);
}

Game.prototype.tileSelection = function (tile)
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
		this.gameboard.unselectAllTiles();
		this.firstTile = null;
	}
	else
	{
		this.secondTile = tile;
		this.checkValidMove(this.firstTile, tile);
	}
}

Game.prototype.getPossibleMoves = function (tile)
{
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - tile.row; 
	var columnLetter = String.fromCharCode(tile.col + 97);
	
	requestString = 'pieceValidMoves(' + (this.currentPlayer) + ',' + board + ',' + rowNumber +',' + columnLetter + ')'; 
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getPossibleMovesHandler.bind(this));
}

Game.prototype.getPossibleMovesHandler = function(data)
{
	var res = data.target.response;
	
	res = res.replace(new RegExp(',a,', 'g'), ',"a",');
	res = res.replace(new RegExp(',b,', 'g'), ',"b",');
	res = res.replace(new RegExp(',c,', 'g'), ',"c",');
	res = res.replace(new RegExp(',d,', 'g'), ',"d",');
	res = res.replace(new RegExp(',e,', 'g'), ',"e",');
	res = res.replace(new RegExp(',f,', 'g'), ',"f",');
	res = res.replace(new RegExp(',g,', 'g'), ',"g",');
	res = res.replace(new RegExp(',h,', 'g'), ',"h",');

	var newArr = JSON.parse(res);

	var orientation = this.gameboard.getTile(newArr[0][0], newArr[0][1]).piece.orientation;
	
	for(var i = 0; i < newArr.length; i++)
	{
		this.gameboard.getDestinationTile(newArr[i][0], newArr[i][1], orientation, newArr[i][2]).isValidMove = true;		
	}
}

Game.prototype.checkValidMove = function (sourceTile, destTile)
{
	if (sourceTile.row != destTile.row && sourceTile.col != destTile.col) return;
	
	var nMoves = 0;
	if (sourceTile.piece.orientation == 'v' && sourceTile.row != destTile.row)
		nMoves = sourceTile.row - destTile.row;
	else if (sourceTile.piece.orientation == 'h')
		nMoves = destTile.col - sourceTile.col;
	else return;
	
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - sourceTile.row; 
	var columnLetter = String.fromCharCode(sourceTile.col + 97);
	
	requestString = 'valid_move(' + (this.currentPlayer) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkValidMoveHandler.bind(this));
}

Game.prototype.checkValidMoveHandler = function(data)
{
	var res = data.target.response;
	if (res != 'no')
	{
		this.canSelect = false;
		this.makeMove(this.firstTile, res)
	}		
}

Game.prototype.makeMove = function (sourceTile, nMoves)
{
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - sourceTile.row; 
	var columnLetter = String.fromCharCode(sourceTile.col + 97);
	
	requestString = 'move(' + (this.currentPlayer) + ',' + JSON.stringify(this.players) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.makeMoveHandler.bind(this));
}

Game.prototype.makeMoveHandler = function(data)
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
		this.playersHistory.push(this.players);		
		// console.log("Players");
		// for(var i = 0; i < this.players.length; i++){
		//	console.log("player " + (i + 1) + ": " + this.players[i][0] + ", " + this.players[i][1]);
		// }

		var newBoard = newArr[1];
		this.boardHistory.push(newBoard);
		var piece = this.firstTile.piece;
		var promotion = false;
		var animations = []
		// console.log('newBoard (' + newBoard.length + ', ' + newBoard[0].length + '):\n' + JSON.stringify(newBoard));

		//ANIMATIONS
		if (this.secondTile.piece){
			animations.push(new FadeAnimation(this.scene, 1, this.secondTile, this.auxboard.tiles[this.secondTile.piece.owner - 1]));
		}
		
		animations.push(new JumpAnimation(this.scene, 1, this.firstTile, this.secondTile));
				
		if (piece.type == 'minion' && newBoard[this.secondTile.row][this.secondTile.col][1] == 'M'){
			promotion = true;
			animations.push(new PromoteAnimation(this.scene, 1, piece));
		}
		
		this.gameSequence.addMove(piece, this.firstTile, this.secondTile, this.secondTile.piece, promotion, animations);
		this.animations = animations.slice();
		
		this.firstTile = null;
		this.secondTile = null;
		this.gameboard.unselectAllTiles();
	}		
}

Game.prototype.getCurrentBoardJSON = function()
{
	var board = JSON.stringify(this.boardHistory[this.boardHistory.length - 1]);
	board = board.replace(new RegExp('M', 'g'), "'M'");
	return board;
}

Game.prototype.update = function (currTime)
{
	if (this.animations.length > 0)
	{
		this.animations[0].update(currTime);
		if (this.animations[0].ended){
			this.animations[0].reset();
			this.animations.shift();
		}
		if (this.animations.length == 0){
			if (this.replaying)
				this.replaying = false;
			else
				this.nextPlayer();
		}
	}
}

Game.prototype.undo = function ()
{
	if(this.gameSequence.moves.length > 0){
		this.gameSequence.undo();
		this.boardHistory.pop();
		this.playersHistory.pop();
		this.previousPlayer();
	}
}

Game.prototype.replay = function ()
{
	this.replaying = true;
	this.gameSequence.replay();
}