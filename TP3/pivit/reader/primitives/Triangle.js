/**
 * Triangle
 * @param x1 point 1 x coordinate.
 * @param y1 point 1 y coordinate.
 * @param z1 point 1 z coordinate.
 * @param x2 point 2 x coordinate.
 * @param y2 point 2 y coordinate.
 * @param z2 point 2 z coordinate.
 * @param x3 point 3 x coordinate.
 * @param y3 point 3 y coordinate.
 * @param z3 point 3 z coordinate.
 * @constructor
 */
function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);

	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;

	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;

	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

/**
 * initBuffers
 */
Triangle.prototype.initBuffers = function () {
	this.vertices = [
   	this.x1, this.y1, this.z1,
   	this.x2, this.y2, this.z2,
   	this.x3, this.y3, this.z3
 	];

 	this.indices = [
 	  0, 1, 2
 	];
 	
 	this.normals = [
 		0, 0, 1,
 		0, 0, 1,
 		0, 0, 1
 	];
 	
 	this.a = Math.sqrt( Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2) + Math.pow(this.z1-this.z3, 2) );
 	this.b = Math.sqrt( Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2) + Math.pow(this.z2-this.z1, 2) );
 	this.c = Math.sqrt( Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2) + Math.pow(this.z3-this.z2, 2) );
 	
 	this.alpha = Math.acos( ( -Math.pow(this.a, 2) + Math.pow(this.b, 2) + Math.pow(this.c, 2) ) / (2 * this.b * this.c ) );
 	this.beta = Math.acos( (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2) ) / (2 * this.a * this.c ) );
 	this.gama = Math.acos( (Math.pow(this.a, 2) + Math.pow(this.b, 2) - Math.pow(this.c, 2) ) / (2 * this.a * this.b ) );
 	
 	
 	this.texCoords = [
 		this.c - this.a * Math.cos(this.beta), this.a * Math.sin(this.beta),
 		0, 0,
 		this.c, 0
 	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
 * Sets the texture scales for a given length.
 * @param length_s s length.
 * @param length_t t length.
 */
Triangle.prototype.setTextureScales = function(length_s, length_t)
{
	 this.texCoords = [
		 (this.c - this.a * Math.cos(this.beta))/length_s, (this.a * Math.sin(this.beta))/length_t,
		 0, 0,
		 this.c / length_s, 0
	 ]
	 this.updateTexCoordsGLBuffers();	 
};
