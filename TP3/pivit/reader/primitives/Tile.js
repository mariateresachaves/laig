
function Tile(scene, board, du, dv, row, col, color, colorSelected, colorValidMove) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.board = board;
	this.row = row;
	this.col = col;
	
	this.x = (this.col-3.5)*du;
	this.z = (3.5-this.row)*dv;
	
	this.isSelected = false;
	this.isValidMove = false;

	this.piece;

	this.plane = new Plane(this.scene, 1, 1, du*5, dv*5);

	var r = color[0];
	var g = color[1];
	var b = color[2];
	var a = color[3];

	this.material1 = new CGFappearance(this.scene);
	this.material1.setAmbient(r,g,b,a);
	this.material1.setDiffuse(r,g,b,a);
	this.material1.setSpecular(r,g,b,a);
	this.material1.setShininess(10);

	this.material2 = new CGFappearance(this.scene);
	this.material2.setAmbient(1,0,0,1);
	this.material2.setDiffuse(1,0,0,1);
	this.material2.setSpecular(1,0,0,1);
	this.material2.setShininess(10);
	
	this.material3 = new CGFappearance(this.scene);
	this.material3.setAmbient(1,1,0,1);
	this.material3.setDiffuse(1,1,0,1);
	this.material3.setSpecular(1,1,0,1);
	this.material3.setShininess(10);
}

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.selected = function()
{
	this.board.tileSelection(this);
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
	this.scene.translate(this.x,0,this.z);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();
	
	if (this.piece)
		this.piece.display();
}
