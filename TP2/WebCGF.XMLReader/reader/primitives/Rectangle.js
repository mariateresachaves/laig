/**
 * Rectangle
 * @param x1 point 1 x coordinate.
 * @param y1 point 1 y coordinate.
 * @param x2 point 2 x coordinate.
 * @param y2 point 2 y coordinate.
 * @constructor
 */
 function Rectangle(scene, x1, y1, x2, y2) {
 	CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;

    this.x2 = x2;
    this.y2 = y2;

 	this.initBuffers();
 };

 Rectangle.prototype = Object.create(CGFobject.prototype);
 Rectangle.prototype.constructor = Rectangle;

/**
 * initBuffers
 */
Rectangle.prototype.initBuffers = function() {
 	this.vertices = [
 		this.x1, this.y1, 0,
 		this.x2, this.y1, 0,
 		this.x2, this.y2, 0,
 		this.x1, this.y2, 0
 	];

 	this.indices = [
 		0, 1, 2,
		0, 2, 3
 	];
 	
 	this.normals = [
 		0, 0, 1,
 		0, 0, 1,
 		0, 0, 1,
 		0, 0, 1
 	]
 	
 	this.deltaX = this.x2 - this.x1;
 	this.deltaY = this.y2 - this.y1;
 	
 	this.texCoords = [
 		0, this.deltaY,
 		0, 0,
 		this.deltaX, 0,
 		this.deltaX, this.deltaY
 	]
  
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * Sets the texture scales for a given length.
 * @param length_s s length.
 * @param length_t t length.
 */
 Rectangle.prototype.setTextureScales = function(length_s, length_t) {
	 this.texCoords = [
		0, this.deltaY / length_t,
		0, 0,
		this.deltaX / length_s, 0,
		this.deltaX / length_s, this.deltaY / length_t
	 ]
	 this.updateTexCoordsGLBuffers();	 
 };
