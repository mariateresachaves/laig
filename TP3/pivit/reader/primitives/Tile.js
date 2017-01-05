
function Tile(scene, board, du, dv, row, col, materialID, materialSelectedID, materialValidMoveID) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.board = board;
	this.row = row;
	this.col = col;
	
	this.materialID = materialID;
	this.materialSelectedID = materialSelectedID;
	this.materialValidMoveID = materialValidMoveID;	
	
	this.x = (this.col + 0.5) * du;
	this.z = -(0.5 + this.row) * dv;
	
	this.isSelected = false;
	this.isValidMove = false;

	this.pieces = [];

	this.plane = new Plane(this.scene, du, dv, 5, 5);
}

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.selected = function()
{
	this.board.game.tileSelection(this);
}

Tile.prototype.addPiece = function(piece)
{
	this.pieces.push(piece);
	piece.tile = this;
}

Tile.prototype.removeTopPiece = function()
{
	if (this.pieces.length > 0)
		this.pieces.pop();
}

Tile.prototype.replaceTopPiece = function(piece)
{
	this.removeTopPiece();
	this.AddPiece(piece);
}

Tile.prototype.hasPieces = function()
{
	return (this.pieces.length > 0);
}

Tile.prototype.getTopPiece = function()
{
	if (this.pieces.length > 0)
		return this.pieces[this.pieces.length - 1];
	else
		return null;
}

Tile.prototype.getTopPieceOrientation = function()
{
	return this.pieces[this.pieces.length - 1].orientation;
}

Tile.prototype.getTopPieceType = function()
{
	return this.pieces[this.pieces.length - 1].type;
}

Tile.prototype.getTopPieceOwner = function()
{
	return this.pieces[this.pieces.length - 1].owner;
}

/**
 * Tile display function.
 */
Tile.prototype.display = function(texture, drawPieceOrientation)
{
	this.scene.pushMatrix();
	if (this.isSelected)
		var material = this.scene.graph.materials[this.materialSelectedID];
	else if (this.isValidMove)
		var material = this.scene.graph.materials[this.materialValidMoveID];
	else
		var material = this.scene.graph.materials[this.materialID];
	
	if(texture && texture != "none")
		material.setTexture(texture);
	else
		material.setTexture(null);
	
	material.apply();
	this.scene.translate(this.x, 0, this.z);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();
	
	for(var i = 0; i < this.pieces.length; i++){	
		this.pieces[i].display(drawPieceOrientation, i);
	}
}
