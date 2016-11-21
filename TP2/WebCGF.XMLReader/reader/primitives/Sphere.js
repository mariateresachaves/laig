/**
 * Sphere
 * @param radius sphere radius.
 * @param slices number of slices.
 * @param stacks number of stacks.
 * @constructor
 */
 function Sphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);

 	this.radius = radius;
 	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

/**
 * initBuffers
 */
Sphere.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];
 	this.texCoords = [];

 	var alpha = 2*Math.PI/this.slices;

 	for(j = 0; j <= this.stacks; j++)
	{
 		if(j < this.stacks)
 		{
 			for(i = 0; i <= this.slices; i++)
 			{
 				var x = Math.cos(alpha*i) * Math.cos(Math.asin(j/this.stacks));
 				var y = Math.sin(alpha*i) * Math.cos(Math.asin(j/this.stacks));
 				var z = j/this.stacks;

 				this.vertices.push(this.radius * x);
	 			this.vertices.push(this.radius * y);
	 			this.vertices.push(this.radius * z);

	 			this.normals.push(x);
	 			this.normals.push(y);
				this.normals.push(z);

				this.texCoords.push(0.5*x + 0.5, 0.5 - 0.5*y);

				if(j < this.stacks-1 && i != this.slices)
				{
					var i0 = (this.slices+1)*j + i;
					var i1 = i0 + 1;
					var i2 = (this.slices+1)*(j+1) + i;
					var i3 = i2 + 1;
					
					this.indices.push( i0, i1, i3, i3, i2, i0 );
				}
 			}
 		}
 		else
 		{
 			this.vertices.push(0, 0, this.radius);

	 		this.normals.push(0, 0, 1);

			this.texCoords.push(.5, .5);
			
			var i2 = (this.slices + 1) * this.stacks;

	 		for(i = 0; i < this.slices; i++)
 			{
				var i0 = (this.slices+1)*(j-1) + i;
				var i1 = i0 + 1;
	 			
 				this.indices.push(i0, i1, i2);
 			}
 		}
 	}
 	
 	startIndex = (this.slices + 1) * this.stacks + 1;
 	
 	//mirror
 	for(j = 0; j <= this.stacks; j++)
	{
 		if(j < this.stacks)
 		{
 			for(i = 0; i <= this.slices; i++)
 			{
 				var x = Math.cos(alpha*i) * Math.cos(Math.asin(j/this.stacks));
 				var y = Math.sin(alpha*i) * Math.cos(Math.asin(j/this.stacks));
 				var z = -j/this.stacks;

 				this.vertices.push(this.radius * x);
	 			this.vertices.push(this.radius * y);
	 			this.vertices.push(this.radius * z);

	 			this.normals.push(x);
	 			this.normals.push(y);
				this.normals.push(z);

				this.texCoords.push(0.5*x + 0.5, 0.5 - 0.5*y);

				if(j < this.stacks-1 && i != this.slices)
				{
					var i0 = startIndex + (this.slices+1)*j + i;
					var i1 = i0 + 1;
					var i2 = startIndex + (this.slices+1)*(j+1) + i;
					var i3 = i2 + 1;
					
					this.indices.push( i0, i2, i3, i3, i1, i0 );
				}
 			}
 		}
 		else
 		{
 			this.vertices.push(0, 0, -this.radius);

	 		this.normals.push(0, 0, -1);

			this.texCoords.push(.5, .5);
			
			var i2 = startIndex + (this.slices + 1) * this.stacks;

	 		for(i = 0; i < this.slices; i++)
 			{
				var i0 = startIndex + (this.slices+1)*(j-1) + i;
				var i1 = i0 + 1;
	 			
 				this.indices.push(i0, i2, i1);
 			}
 		}
 	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
