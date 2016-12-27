
function GameBoard(scene, players) {
    Board.call(this, scene);

    this.scene = scene;
	
	this.players = players;

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
	
	var isWhite = 0;
	for(i = 0; i < 8; i++)
	{
		this.tiles[i] = new Object;
		for(j = 0; j < 8; j++)
		{
			if (isWhite){
				var color = vec4.fromValues(1, 1, 1, 1);
				isWhite = 0;
			}
			else{
				var color = vec4.fromValues(0, 0, 0, 1);
				isWhite = 1;
			}
			this.tiles[i][j] = new Tile(this.scene, this, 1, 1, i, j, color, vec4.fromValues(1, 0, 0, 1), vec4.fromValues(0, 1, 0, 1));			
		}
		isWhite -= 1;
	}
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;

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
		}
	}
	
	//this.scene.setActiveShader(this.scene.defaultShader);
}
