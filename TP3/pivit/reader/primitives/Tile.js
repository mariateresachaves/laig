
function Tile(scene, board, du, dv, row, col, color, colorSelected, colorValidMove) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.board = board;
	this.row = row;
	this.col = col;
	
	this.x = (this.col + 0.5) * du;
	this.z = -(0.5 + this.row) * dv;
	
	this.isSelected = false;
	this.isValidMove = false;

	this.piece;

	this.plane = new Plane(this.scene, du, dv, 5, 5);

	this.material1 = new CGFappearance(this.scene);
	this.material1.setAmbient(color[0], color[1], color[2], color[3]);
	this.material1.setDiffuse(color[0], color[1], color[2], color[3]);
	this.material1.setSpecular(color[0], color[1], color[2], color[3]);
	this.material1.setShininess(10);

	this.material2 = new CGFappearance(this.scene);
	this.material2.setAmbient(colorSelected[0], colorSelected[1], colorSelected[2], colorSelected[3]);
	this.material2.setDiffuse(colorSelected[0], colorSelected[1], colorSelected[2], colorSelected[3]);
	this.material2.setSpecular(colorSelected[0], colorSelected[1], colorSelected[2], colorSelected[3]);
	this.material2.setShininess(10);
	
	this.material3 = new CGFappearance(this.scene);
	this.material3.setAmbient(colorValidMove[0], colorValidMove[1], colorValidMove[2], colorValidMove[3]);
	this.material3.setDiffuse(colorValidMove[0], colorValidMove[1], colorValidMove[2], colorValidMove[3]);
	this.material3.setSpecular(colorValidMove[0], colorValidMove[1], colorValidMove[2], colorValidMove[3]);
	this.material3.setShininess(10);
}

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.selected = function()
{
	this.board.game.tileSelection(this);
}

/**
 * Tile display function.
 */
Tile.prototype.display = function()
{
	this.scene.pushMatrix();
	if (this.isSelected)
		this.material2.apply();
	else if (this.isValidMove)
		this.material3.apply();
	else
		this.material1.apply();
	this.scene.translate(this.x, 0, this.z);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();
	
	if (this.piece)
		this.piece.display();
}
