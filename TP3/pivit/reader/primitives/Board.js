
function Board(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.tiles = new Object;
}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

/**
 * Board display function.
 */
Board.prototype.display = function() {


}