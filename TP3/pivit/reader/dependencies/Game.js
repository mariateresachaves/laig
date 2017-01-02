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
	//console.log('startingBoard (' + startingBoard.length + ', ' + startingBoard[0].length + '):\n' + JSON.stringify(startingBoard));

	this.gameboard.createPieces(startingBoard);
	
	this.state = Game.States.selectMove;
}

Game.prototype.checkGameOver = function ()
{
	var board = this.getCurrentBoardJSON();
	requestString = 'game_over(' + board + ',' + JSON.stringify(this.players) + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkGameOverHandler.bind(this));

  this.state = Game.States.checkGameOverRequested;
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
		this.text = 'GAME OVER\nPlayer ' + newArr[0] + ' won (' + newArr[1] + ')';
		//var newArr = JSON.parse(res);

    this.state = Game.States.gameOver;
	}
	else
    this.state = Game.States.checkPlayerEliminated;
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
	var res = data.target.response;
	if (res == 'yes')
    this.state = Game.States.nextPlayer;
	else
    this.state = Game.States.checkNoValidMoves;
}

Game.prototype.checkPlayerHasValidMoves = function ()
{
	var board = this.getCurrentBoardJSON();
	requestString = 'no_valid_moves(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkPlayerHasValidMovesHandler.bind(this));

  this.state = Game.States.checkNoValidMovesRequested;
}

Game.prototype.checkPlayerHasValidMovesHandler = function(data)
{
	var res = data.target.response;
	if (res == 'yes')
    this.state = Game.States.nextPlayer;
	else
    this.state = Game.States.selectMove;
}

Game.prototype.nextPlayer = function ()
{
	this.currentPlayer = this.currentPlayer % this.nPlayers + 1;
	this.state = Game.States.checkGameOver;
}

Game.prototype.selectMove = function ()
{
	if (this.players[this.currentPlayer - 1][0] == 'computer')
		this.state = Game.States.getComputerMove;
	else
    this.state = Game.States.waitSelection;
}

Game.prototype.getComputerMove = function ()
{
	var board = this.getCurrentBoardJSON();

	requestString = 'choose_move(' + (this.currentPlayer) + ',' + board + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.getComputerMoveHandler.bind(this));

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
	var rowNumber = newArr[0];
	var columnLetter = newArr[1];
	this.nMoves = newArr[2];

	this.firstTile = this.gameboard.getTile(rowNumber, columnLetter);
	var orientation = this.firstTile.piece.orientation;

	this.secondTile = this.gameboard.getDestinationTile(rowNumber, columnLetter, orientation, this.nMoves)

  if (this.state == Game.States.getComputerMoveRequested)
    this.state = Game.States.makeMove;
}

Game.prototype.tileSelection = function (tile)
{
	if(this.state == Game.States.waitSelection)
	{
		if(tile.piece && tile.piece.owner == this.currentPlayer)
		{
			tile.isSelected = true;
			this.firstTile = tile;
      this.state = Game.States.getPossibleMoves;
		}
	}
	else if(this.state == Game.States.firstTileSelected)
	{
    if (this.firstTile == tile) {
      this.gameboard.unselectAllTiles();
  		this.firstTile = null;
      this.state = Game.States.waitSelection;
    } else {
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

	var orientation = this.gameboard.getTile(newArr[0][0], newArr[0][1]).piece.orientation;

	for(var i = 0; i < newArr.length; i++)
	{
		this.gameboard.getDestinationTile(newArr[i][0], newArr[i][1], orientation, newArr[i][2]).isValidMove = true;
	}

  if (this.state == Game.States.getPossibleMovesRequested)
    this.state = Game.States.firstTileSelected;
}

Game.prototype.checkValidMove = function ()
{
	if (this.firstTile.row != this.secondTile.row && this.firstTile.col != this.secondTile.col)
    this.state = Game.States.firstTileSelected;

	if (this.firstTile.piece.orientation == 'v' && this.firstTile.row != this.secondTile.row)
		this.nMoves = this.firstTile.row - this.secondTile.row;
	else if (this.firstTile.piece.orientation == 'h' && this.firstTile.col != this.secondTile.col)
		this.nMoves = this.secondTile.col - this.firstTile.col;
	else
    this.state = Game.States.firstTileSelected;

	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - this.firstTile.row;
	var columnLetter = String.fromCharCode(this.firstTile.col + 97);

	requestString = 'valid_move(' + (this.currentPlayer) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + this.nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.checkValidMoveHandler.bind(this));

  this.state = Game.States.checkValidMoveRequested;
}

Game.prototype.checkValidMoveHandler = function(data)
{
	var res = data.target.response;
	if (res != 'no')
	{
    this.state = Game.States.makeMove;
	}

  if (this.state == Game.States.checkValidMoveRequested)
    this.state = Game.States.getComputerMove;
}

Game.prototype.makeMove = function ()
{
	var board = this.getCurrentBoardJSON();
	var rowNumber = 8 - this.firstTile.row;
	var columnLetter = String.fromCharCode(this.firstTile.col + 97);

	requestString = 'move(' + (this.currentPlayer) + ',' + JSON.stringify(this.players) + ',' + board + ',' + rowNumber +',' + columnLetter + ',' + this.nMoves + ')';
	requestString = requestString.replace(new RegExp('"', 'g'), '');
	getPrologRequest(requestString, this.makeMoveHandler.bind(this));

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
		if (this.secondTile.piece) {
			animations.push(new FadeAnimation(this.scene, 1, this.secondTile, this.auxboard.tiles[this.secondTile.piece.owner - 1]));
		}

		animations.push(new JumpAnimation(this.scene, 1, this.firstTile, this.secondTile));

		if (piece.type == 'minion' && newBoard[this.secondTile.row][this.secondTile.col][1] == 'M') {
			promotion = true;
			animations.push(new PromoteAnimation(this.scene, 1, piece));
		}

		this.gameSequence.addMove(this.currentPlayer, piece, this.firstTile, this.secondTile, this.secondTile.piece, promotion, animations);
		this.animations = animations.slice();

		this.firstTile = null;
		this.secondTile = null;
		this.gameboard.unselectAllTiles();

    this.state = Game.States.animations;
	}
}

Game.prototype.getCurrentBoardJSON = function()
{
	var board = JSON.stringify(this.boardHistory[this.boardHistory.length - 1]);
	board = board.replace(new RegExp('M', 'g'), "'M'");
	return board;
}

Game.prototype.runAnimations = function (currTime)
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
        this.state = Game.States.nextPlayer;
		}
	}
}

Game.prototype.update = function (currTime)
{
	if (!this.locked)
	{
		this.locked = true;
		
		switch (this.state)
		{
			case Game.States.newGame:
			this.requestNewGame();
			break;
			
			case Game.States.selectMove:
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
			
			case Game.States.undo:
			break;
			
			case Game.States.replay:
			this.runAnimations(currTime);
			if (this.animations.length == 0)
				this.state = Game.States.checkGameOver;
			break;
			
			case Game.States.gameOver:
			// TODO: Acrescentar o texto e voltar ao menu inicial
			break;
			
			default:
			break;
		}
		this.locked = false;
	}
}

Game.prototype.undo = function ()
{
	if(this.gameSequence.moves.length > 0)
	{
		this.state = Game.States.undo;
		this.currentPlayer = this.gameSequence.getLastMovePlayer();
		this.gameSequence.undo();
		this.boardHistory.pop();
		this.playersHistory.pop();
		this.state = Game.States.selectMove;
	}
}

Game.prototype.replay = function ()
{
	if(this.gameSequence.moves.length > 0)
	{
		this.state = -1;
		this.gameSequence.replay();
		this.state = Game.States.replay;
	}
}