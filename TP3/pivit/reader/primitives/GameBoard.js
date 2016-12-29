
function GameBoard(scene, playerTypes) {
    Board.call(this, scene);

    this.scene = scene;
	
	this.playerTypes = playerTypes;
	
	this.pieceRadius = 0.5;
	this.pieceHeight = 0.1;

	// this.texture = this.scene.graph.textures[textureref].CGFtexture;
	
	// this.shader = new CGFshader(this.scene.gl, "shaders/chess.vert", "shaders/chess.frag");
    // this.shader.setUniformsValues(
		// {
			// uSample : 0,
			// color : color,
			// colorSelected : colorSelected,
			// colorValidMove : colorValidMove,
			// isSelected : 0.0,
			// isValidMove: 0.0
		// }
	// );

	this.tiles = new Object;
	
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
			this.tiles[i][j] = new Tile(this.scene, this, 1, 1, i, j, color, vec4.fromValues(1, 0, 0, 1), vec4.fromValues(0, 1, 0, 1));			
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
	res = res.replace(new RegExp(',v', 'g'), ',"v"');
	res = res.replace(new RegExp(',h', 'g'), ',"h"');				
		
	var newArr = JSON.parse(res);
	
	this.players = newArr[0];				
	console.log("Players");
	for(var i = 0; i < this.players.length; i++){
		console.log("player " + (i + 1) + ": " + this.players[i][0] + ", " + this.players[i][1]);
	}
				
	this.startingBoard = newArr[1];
	console.log('startingBoard (' + this.startingBoard.length + ', ' + this.startingBoard[i].length + '): ' + this.startingBoard);	
	console.log("\nBoard");
	for(var i = 0; i < this.startingBoard.length; i++)
	{
		for(var j = 0; j < this.startingBoard[i].length; j++)
		{
			var tile = this.tiles[i][j];
			if (this.startingBoard[i][j].length != 0)
			{
				tile.piece = new Piece(
					this.scene,
					this.pieceRadius,
					this.pieceHeight,
					'minion' + this.startingBoard[i][j][0],
					'master' + this.startingBoard[i][j][0],
					this.startingBoard[i][j][0],
					tile,
					this.startingBoard[i][j][2]);
				console.log('Board[' + i + ', ' + j + ']: ' + this.startingBoard[i][j]);
			}
		}
	}	
}

GameBoard.prototype.getTile = function(row, col)
{
	return this.tiles[row][col];
}

/**
 * GameBoard display function.
 */
GameBoard.prototype.display = function()
{
	//this.scene.setActiveShader(this.shader);
	//this.texture.bind(0);
	var i = 1;
	for(row in this.tiles) {
		for(column in this.tiles[row]) {
			this.scene.registerForPick(i, this.tiles[row][column]);
			i++;
			this.tiles[row][column].display();
			if (this.tiles[row][column].piece)
				this.tiles[row][column].piece.display();
		}
	}
	
	//this.scene.setActiveShader(this.scene.defaultShader);
}
