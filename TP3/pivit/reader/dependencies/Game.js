Game.States = {
	newGame:                        0,
	newGameRequested:               1,
	selectMove:                     2,
	waitSelection:                  3,
	getPossibleMoves:               4,
	getPossibleMovesRequested:      5,
	firstTileSelected:              6,
	checkValidMove:                 7,
	checkValidMoveRequested:        8,
	getComputerMove:                9,
	getComputerMoveRequested:       10,
	makeMove:                       11,
	makeMoveRequested:              12,
	animations:                     13,
	nextPlayer:                     14,
	checkGameOver:                  15,
	checkGameOverRequested:         16,
	gameOver:                       17,
	checkPlayerEliminated:          18,
	checkPlayerEliminatedRequested: 19,
	checkNoValidMoves:              20,
	checkNoValidMovesRequested:     21,
	undo:                           22,
	replay:                         23
};

function Game(scene, playerTypes)
{
	this.scene = scene;
	
	this.playerTypes = playerTypes;
	this.nPlayers = playerTypes.length;
	this.players;
	this.currentPlayer = 1;

	this.boardHistory = [];
	this.playersHistory = [];
	this.animations = [];
	this.text = '';

	this.firstTile;
	this.secondTile;
	this.nMoves;
	
	this.lastTime;
	this.gameTime = 0;
	this.countTime = false;

	this.gameboard = new GameBoard(this.scene, this);
	this.auxboard = new AuxiliaryBoard(this.scene, this, this.nPlayers);
	this.gameSequence = new GameSequence(this.scene);
	this.state = Game.States.newGame;
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

Game.prototype.requestNewGame = function ()
{
	requestString = 'newgame(' + this.playerTypes.length + ',[' + this.playerTypes + '])';
	getPrologRequest(requestString, this.newGameHandler.bind(this));

	this.state = Game.States.newGameRequested;
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
	this.gameboard.createPieces(startingBoard);
	this.displayStatistics();
	
	this.state = Game.States.selectMove;
}

Game.prototype.checkGameOver = function ()
{
	var board = this.getCurrentBoardJSON();
	requestString = 'game_over(' + board + ',' + JSON.stringify(this.players) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkGameOverHandler.bind(this));
	
	if (this.state == Game.States.checkGameOver)
		this.state = Game.States.checkGameOverRequested;
}

Game.prototype.checkGameOverHandler = function(data)
{
	var res = data.target.response;

	if (this.state == Game.States.checkGameOverRequested)
	{
		if (res != '[]')
		{
			this.state = Game.States.gameOver;
			
			res = res.replace(new RegExp('First Master', 'g'), '"First Master"');
			res = res.replace(new RegExp('Last player standing', 'g'), '"Last player standing"');
			res = res.replace(new RegExp('Most Masters', 'g'), '"Most Masters"');

			var newArr = JSON.parse(res);
			this.updateInfoText('GAME OVER<BR>Player ' + newArr[0] + ' won<BR>(' + newArr[1] + ')');
			this.showReturnButton(true);
		}
		else{
			this.state = Game.States.checkPlayerEliminated;
		}
	}
}

Game.prototype.checkPlayerEliminated = function ()
{
	var board = this.getCurrentBoardJSON();
	requestString = 'player_eliminated(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerEliminatedHandler.bind(this));

	this.state = Game.States.checkPlayerEliminatedRequested;
}

Game.prototype.checkPlayerEliminatedHandler = function(data)
{
	if (this.state == Game.States.checkPlayerEliminatedRequested)
	{
		var res = data.target.response;
		if (res == 'yes')
			this.state = Game.States.nextPlayer;
		else
			this.state = Game.States.checkNoValidMoves;
	}
}

Game.prototype.checkPlayerHasValidMoves = function ()
{
	if (this.state = Game.States.checkNoValidMoves)
	{
		var board = this.getCurrentBoardJSON();
		requestString = 'no_valid_moves(' + (this.currentPlayer) + ',' + board + ')';
		requestString = requestString.replace(new RegExp('"', 'g'), '');
		getPrologRequest(requestString, this.checkPlayerHasValidMovesHandler.bind(this));
		
		this.state = Game.States.checkNoValidMovesRequested;
	}
}

Game.prototype.checkPlayerHasValidMovesHandler = function(data)
{
	if (this.state == Game.States.checkNoValidMovesRequested)
	{
		var res = data.target.response;
		if (res == 'yes')
		{
			this.updateInfoText('Skipping Player ' + this.currentPlayer + '\nNo valid moves');
			sleep(2);
			this.state = Game.States.nextPlayer;
		}		
		else
			this.state = Game.States.selectMove;
	}
}

Game.prototype.nextPlayer = function ()
{
	this.currentPlayer = this.currentPlayer % this.nPlayers + 1;
	this.state = Game.States.checkGameOver;
}

Game.prototype.selectMove = function ()
{
	if(this.state == Game.States.selectMove)
	{
		this.updateInfoText('Player ' + this.currentPlayer + ' turn');
		if (this.players[this.currentPlayer - 1][0] == 'computer')
			this.state = Game.States.getComputerMove;
		else
			this.state = Game.States.waitSelection;
	}
}

Game.prototype.getComputerMove = function ()
{
	var board = this.getCurrentBoardJSON();

	requestString = 'choose_move(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getComputerMoveHandler.bind(this));

	if (this.state == Game.States.getComputerMove)
		this.state = Game.States.getComputerMoveRequested;
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
	
	if (this.state == Game.States.getComputerMoveRequested)
	{
		var rowNumber = newArr[0];
		var columnLetter = newArr[1];
		this.nMoves = newArr[2];
		
		this.firstTile = this.gameboard.getTile(rowNumber, columnLetter);
		var orientation = this.firstTile.getTopPieceOrientation();		
		this.secondTile = this.gameboard.getDestinationTile(rowNumber, columnLetter, orientation, this.nMoves);

		this.state = Game.States.makeMove;
	}
}

Game.prototype.tileSelection = function (tile)
{
	if(this.state == Game.States.waitSelection)
	{
		if(tile.hasPieces() && tile.getTopPieceOwner() == this.currentPlayer)
		{
			tile.isSelected = true;
			this.firstTile = tile;

			this.state = Game.States.getPossibleMoves;
		}
	}
	else if(this.state == Game.States.firstTileSelected)
	{
		if (this.firstTile == tile)
		{
			this.gameboard.unselectAllTiles();
			this.firstTile = null;
			this.state = Game.States.waitSelection;
		}
		else
		{
			this.secondTile = tile;
			this.state = Game.States.checkValidMove;
		}
	}
}

Game.prototype.getPossibleMoves = function ()
{
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - this.firstTile.row;
	var columnLetter = String.fromCharCode(this.firstTile.col + 97);

	requestString = 'pieceValidMoves(' + (this.currentPlayer) + ',' + board + ',' + rowNumber +',' + columnLetter + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getPossibleMovesHandler.bind(this));

	if(this.state == Game.States.getPossibleMoves)
		this.state = Game.States.getPossibleMovesRequested;
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

	var orientation = this.gameboard.getTile(newArr[0][0], newArr[0][1]).getTopPieceOrientation();

	for(var i = 0; i < newArr.length; i++)
	{
		this.gameboard.getDestinationTile(newArr[i][0], newArr[i][1], orientation, newArr[i][2]).isValidMove = true;
	}

	if (this.state == Game.States.getPossibleMovesRequested)
		this.state = Game.States.firstTileSelected;
}

Game.prototype.checkValidMove = function ()
{
	if (this.firstTile.row != this.secondTile.row && this.firstTile.col != this.secondTile.col){
		this.state = Game.States.firstTileSelected;
		return;
	}

	if (this.firstTile.getTopPieceOrientation() == 'v' && this.firstTile.row != this.secondTile.row)
		this.nMoves = this.firstTile.row - this.secondTile.row;
	else if (this.firstTile.getTopPieceOrientation() == 'h' && this.firstTile.col != this.secondTile.col)
		this.nMoves = this.secondTile.col - this.firstTile.col;
	else{
		this.state = Game.States.firstTileSelected;
		return;
	}

	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - this.firstTile.row;
	var columnLetter = String.fromCharCode(this.firstTile.col + 97);

	requestString = 'valid_move(' + (this.currentPlayer) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + this.nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkValidMoveHandler.bind(this));
	
	if (this.state == Game.States.checkValidMove)
		this.state = Game.States.checkValidMoveRequested;
}

Game.prototype.checkValidMoveHandler = function(data)
{
	if (this.state == Game.States.checkValidMoveRequested)
	{
		var res = data.target.response;
		if (res != 'no')
		{
			this.state = Game.States.makeMove;
		}
		else
		{
			this.state = Game.States.firstTileSelected;
		}
	}
}

Game.prototype.makeMove = function ()
{
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - this.firstTile.row;
	var columnLetter = String.fromCharCode(this.firstTile.col + 97);

	requestString = 'move(' + (this.currentPlayer) + ',' + JSON.stringify(this.players) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + this.nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.makeMoveHandler.bind(this));
	
	if (this.state == Game.States.makeMove)
		this.state = Game.States.makeMoveRequested;
}

Game.prototype.makeMoveHandler = function(data)
{
	var res = data.target.response;
	
	if (res != [] && this.state == Game.States.makeMoveRequested)
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

		var newBoard = newArr[1];
		this.boardHistory.push(newBoard);
		this.displayStatistics();
		var piece = this.firstTile.getTopPiece();
		var promotion = false;
		var animations = [];

		//ANIMATIONS
		if ( this.secondTile.hasPieces() ) {
			animations.push(new FadeAnimation(this.scene, 1, this.secondTile, this.auxboard.tiles[this.secondTile.getTopPieceOwner() - 1]));
		}

		animations.push(new JumpAnimation(this.scene, 1, this.firstTile, this.secondTile));

		if (piece.type == 'minion' && newBoard[this.secondTile.row][this.secondTile.col][1] == 'M') {
			promotion = true;
			animations.push(new PromoteAnimation(this.scene, 1, piece));
		}

		this.gameSequence.addMove(this.currentPlayer, piece, this.firstTile, this.secondTile, this.secondTile.getTopPiece(), promotion, animations);
		this.animations = animations.slice();

		this.firstTile = null;
		this.secondTile = null;
		this.gameboard.unselectAllTiles();
		
		this.state = Game.States.animations;
	}
}

Game.prototype.runAnimations = function (currTime)
{
	if (this.animations.length > 0)
	{
		this.animations[0].update(currTime);
		if (this.animations[0].ended)
		{
			this.animations[0].reset();
			this.animations.shift();
		}
	}
}

Game.prototype.update = function (currTime)
{
	var elapsedTime = 0;
	
	if(this.lastTime && this.countTime)
		this.gameTime += (currTime - this.lastTime)/1000;
	
	this.lastTime = currTime;
	this.displayGameTime();
	
	if (!this.locked)
	{
		this.locked = true;
		
		switch (this.state)
		{
			case Game.States.newGame:
				this.requestNewGame();
				break;
			
			case Game.States.selectMove:
				this.countTime = true;
				this.selectMove();
				break;
			
			case Game.States.getPossibleMoves:
				this.getPossibleMoves();
				break;
			
			case Game.States.checkValidMove:
				this.checkValidMove();
				break;
			
			case Game.States.getComputerMove:
				this.getComputerMove();
				break;
			
			case Game.States.makeMove:
				this.makeMove();
				this.countTime = false;
				break;
			
			case Game.States.animations:
				this.runAnimations(currTime);
				if (this.animations.length == 0)
					this.state = Game.States.nextPlayer;
				break;
			
			case Game.States.nextPlayer:
				this.nextPlayer();
				break;
			
			case Game.States.checkGameOver:
				this.checkGameOver();
				break;
			
			case Game.States.checkPlayerEliminated:
				this.checkPlayerEliminated();
				break;
			
			case Game.States.checkNoValidMoves:
				this.checkPlayerHasValidMoves();
				break;
			
			case Game.States.replay:
				this.runAnimations(currTime);
				if (this.animations.length == 0)
					this.state = Game.States.checkGameOver;
				break;
				
			default:
				break;
		}
		this.locked = false;
	}
}

Game.prototype.undo = function ()
{
	if(this.gameSequence.moves.length > 0 && this.state != Game.States.animations && this.state != Game.States.replay)
	{
		this.state = Game.States.undo;
		this.countTime = false;
		this.showReturnButton(false);
		this.gameboard.unselectAllTiles();
		this.firstTile = null;
		this.secondTile = null;
		this.currentPlayer = this.gameSequence.getLastMovePlayer();
		this.updateInfoText('Player ' + this.currentPlayer + ' turn');
		this.gameSequence.undo();
		this.boardHistory.pop();
		this.playersHistory.pop();
		this.state = Game.States.selectMove;
	}
}

Game.prototype.replay = function ()
{
	if(this.gameSequence.moves.length > 0 && this.state != Game.States.animations && this.state != Game.States.replay && this.state != Game.States.undo)
	{
		this.state = -1;
		this.countTime = false;
		this.gameboard.unselectAllTiles();
		this.firstTile = null;
		this.secondTile = null;
		this.gameSequence.replay();
		this.state = Game.States.replay;
	}
}

Game.prototype.updateInfoText = function (text)
{
	document.getElementById('infoText').innerHTML = text;
}

Game.prototype.showReturnButton = function (boolean)
{
	if(boolean)
		document.getElementById('return').innerHTML = '<a href="index.html">Return to Main Menu</a>';
	else
		document.getElementById('return').innerHTML = '';
}

Game.prototype.displayGameTime = function()
{
    var h = Math.floor(this.gameTime/3600);

    var m = Math.floor( (this.gameTime / 60) % 60);
	if (m < 10) m = "0" + m;
	
    var s = Math.floor(this.gameTime % 60);
    if (s < 10) s = "0" + s;
	
    document.getElementById('gametime').innerHTML = h + ":" + m + ":" + s;
}

Game.prototype.displayStatistics = function()
{
	var board = this.boardHistory[this.boardHistory.length - 1];
	var playerStats = new Object;
	
	for(var i = 1; i <= this.nPlayers ; i++)
	{
		playerStats[i] = new Object;
		switch (this.players[i-1][1]){
			case 1:
				playerStats[i].firstMaster = '1st';
				break;
			case 2:
				playerStats[i].firstMaster = '2nd';
				break;
			case 3:
				playerStats[i].firstMaster = '3rd';
				break;
			case 4:
				playerStats[i].firstMaster = '4th';
				break;
			default:
				playerStats[i].firstMaster = 'na.';
				break;
		}
		playerStats[i].masters = 0;
		playerStats[i].pieces = 0;
	}
	
	for(var i = 0; i < board.length; i++)
	{
		var boardRow = board[i];
		for(var j = 0; j < boardRow.length; j++)
		{
			if(boardRow[j].length > 0)
			{
				if(boardRow[j][1] == 'M')
					playerStats[boardRow[j][0]].masters++;
				playerStats[boardRow[j][0]].pieces++;
			}
		}		
	}
	
	var text = '';
	for(var i = 1; i <= this.nPlayers; i++)
	{
		text += 'Player ' + i + ': first master = ' +  playerStats[i].firstMaster + ', pieces = ' + playerStats[i].pieces + ', masters = ' + playerStats[i].masters + '<br>';
	}
	
    document.getElementById('statistics').innerHTML = text;
}

Game.prototype.getCurrentBoardJSON = function()
{
	var board = JSON.stringify(this.boardHistory[this.boardHistory.length - 1]);
	board = board.replace(new RegExp('M', 'g'), "'M'");
	return board;
}