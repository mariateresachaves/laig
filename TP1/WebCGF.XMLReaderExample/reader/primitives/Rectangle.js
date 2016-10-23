/**
 * Rectangle
 * @constructor
 */
 function Rectangle(scene, x1, y1, x2, y2/*, minS, maxS, minT, maxT*/) {
 	CGFobject.call(this,scene);

    /*this.minS = minS;
    this.minT = minT;
    this.maxS = maxS;
    this.maxT = maxT;*/

    this.x1 = x1;
    this.y1 = y1;

    this.x2 = x2;
    this.y2 = y2;

 	this.initBuffers();
 };

 Rectangle.prototype = Object.create(CGFobject.prototype);
 Rectangle.prototype.constructor = Rectangle;

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

  var deltaX = this.x2 - this.x1;
	var deltaY = this.y2 - this.y1;

  this.texCoords = [
    0, deltaY,
    0, 0,
    deltaX, 0,
		deltaX, deltaY
  ]
  
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
