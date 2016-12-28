/**
 * Circle
 * @param radius radius of the circle.
 * @param slices number of slices.
 * @constructor
 */
function Circle(scene, radius, slices) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;

    this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

/**
 * initBuffers
 */
Circle.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var alpha = 2 * Math.PI / this.slices;

    // Circle Center
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (i = 0; i < this.slices; i++)
    {
    	this.vertices.push(this.radius * Math.cos(alpha * i));
    	this.vertices.push(this.radius * Math.sin(alpha * i));
    	this.vertices.push(0);

    	this.normals.push(0, 0, 1);
    	
    	this.texCoords.push(0.5 * Math.cos(alpha * i) + 0.5)
    	this.texCoords.push(0.5 - 0.5 * Math.sin(alpha * i));
    	
    	if (i == this.slices - 1)
    	{
    		this.indices.push(1);
    		this.indices.push(0);
    		this.indices.push(i + 1);
    	}
    	else
    	{
    		this.indices.push(i + 2);
    		this.indices.push(0);
    		this.indices.push(i + 1);
    	}
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
