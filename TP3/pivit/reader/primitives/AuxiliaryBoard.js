
function Tile(scene, board, du, dv, row, col, textureref, color, colorSelected, colorValidMove) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.board = board;
	this.row = row;
	this.col = col;
	this.x = (this.col-4.5)*du;
	this.z = (4.5-this.row)*dv;
	this.isSelected = 0;
	this.isValidMove = 0;
	
	this.plane = new Plane(this.scene, 1, 1, du*5, dv*5);
		
	// this.texture = this.scene.graph.textures[textureref].CGFtexture;

	this.shader = new CGFshader(this.scene.gl, "shaders/chess.vert", "shaders/chess.frag");
    this.shader.setUniformsValues(
		{
			uSample : 0,
			color : color,
			colorSelected : colorSelected,
			colorValidMove : colorValidMove,
			isSelected : 0.0,
			isValidMove: 0.0
		}
	);
}

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

/**
 * ChessBoard display function.
 */
Tile.prototype.display = function() {

    //this.scene.setActiveShader(this.shader);

	this.scene.pushMatrix();
    //this.texture.bind(0);
	this.scene.translate(this.x,0,this.z);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();

    //this.scene.setActiveShader(this.scene.defaultShader);
}