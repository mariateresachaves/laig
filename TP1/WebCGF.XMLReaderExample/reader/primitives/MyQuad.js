/**
 * MyQuad
 * @constructor
 */
 function MyQuad(scene, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
  
    this.minS = minS;
    this.minT = minT;
    this.maxS = maxS;
    this.maxT = maxT;

 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {
 	this.vertices = [
 	-0.5, -0.5, 0,
 	0.5, -0.5, 0,
 	-0.5, 0.5, 0,
 	0.5, 0.5, 0
 	];

 	this.indices = [
 	0, 1, 2, 
 	3, 2, 1
 	];

    this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
    ]
    
   this.texCoords = [
    this.minS, this.maxT, //(0,1)
    this.maxS,  this.maxT, //(1,1)
    this.minS,  this.minT,
    this.maxS,  this.minT
   
    ]

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
