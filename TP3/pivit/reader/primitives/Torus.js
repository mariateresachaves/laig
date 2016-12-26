/**
 * Torus
 * @param innerRadius torus inner radius.
 * @param outerRadius torus outer radius.
 * @param slices number of slices.
 * @param loops number of loops.
 * @constructor
 */
function Torus(scene, innerRadius, outerRadius, slices, loops) {
	CGFobject.call(this,scene);

	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.slices = slices;
	this.loops = loops;

 	this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

/**
 * initBuffers
 */
Torus.prototype.initBuffers = function() {
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var alpha = 2 * Math.PI / this.loops;
	var beta = 2 * Math.PI / this.slices;
	var R = this.outerRadius;
	var r = this.innerRadius;

	for(i = 0; i <= this.loops; i++)
	{
		for(j = 0; j <= this.slices; j++)
		{
			var x = (R + r * Math.cos(beta*j) ) * Math.cos(alpha*i);
			var y = (R + r * Math.cos(beta*j) ) * Math.sin(alpha*i);
			var z = -r * Math.sin(beta*j);			
			this.vertices.push(x, y, z);
			
			var nx = Math.cos(beta*j) * Math.cos(alpha*i);
			var ny = Math.cos(beta*j) * Math.sin(alpha*i);
			var nz = -Math.sin(beta*j);
			this.normals.push(nx, ny, nz);
			
			if (i != this.loops && j != this.slices)
			{
				var i0 = (this.slices + 1) * i + j;
				var i1 = i0 + 1;
				var i2 = (this.slices + 1) * (i + 1) + j;
				var i3 = i2 + 1;
				
				this.indices.push(i0, i1, i3, i3, i2, i0);
			}
	
			this.texCoords.push(i/this.slices, j/this.loops);
		}
	}
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
