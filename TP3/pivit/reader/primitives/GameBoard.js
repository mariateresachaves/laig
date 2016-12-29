
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
	for(i = 0; i < 8; i++)
	{
		this.tiles[i] = new Object;
		for(j = 0; j < 8; j++)
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
	this.getPrologRequest(requestString, this.newGameHandler.bind(this));
}

GameBoard.prototype.newGameHandler = function(data)
{
	var x = data.target.response;
				
	x = x.replace(new RegExp('computer', 'g'), '"computer"');
	x = x.replace(new RegExp('human', 'g'), '"human"');
	x = x.replace(new RegExp(',m,', 'g'), ',"m",');
	x = x.replace(new RegExp(',v', 'g'), ',"v"');
	x = x.replace(new RegExp(',h', 'g'), ',"h"');				
		
	var newArr = JSON.parse(x);
	
	this.players = newArr[0];				
	console.log("Players");
	for(i = 0; i < this.players.length; i++){
		console.log("player " + i + ": " + this.players[i][0] + ", " + this.players[i][1]);
	}
	
	var z = this.tiles;
				
	this.startingBoard = newArr[1];				
	console.log("\nBoard");
	for(i = 0; i < this.startingBoard.length; i++){
		for(j = 0; j < this.startingBoard[i].length; j++){
			var tile = this.tiles[i][j];
			if (this.startingBoard[i][j])
				tile.piece = new Piece(
					this.scene,
					this.pieceRadius,
					this.pieceHeight,
					'minion1',
					'master1',
					this.startingBoard[i][j][0],
					tile,
					this.startingBoard[i][j][2]);
			console.log('x[' + i + ', ' + j + ']: ' + this.startingBoard[i][j]);
		}
	}	
}

GameBoard.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
	
	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
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
