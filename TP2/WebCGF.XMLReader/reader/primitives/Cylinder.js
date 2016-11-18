/**
 * Cylinder
 * 
 * @constructor
 */
function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.height = height;
    this.base = base;
    this.top = top;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var alpha = 2 * Math.PI / this.slices;

    for (j = 0; j <= this.stacks; j++)
    {
    	var radius = this.base + (this.top - this.base) * j / this.stacks;
    	
        for (i = 0; i < this.slices; i++)
        {
            this.vertices.push(radius * Math.cos(alpha * i));
            this.vertices.push(radius * Math.sin(alpha * i));
            this.vertices.push(this.height * j / this.stacks);

            this.normals.push(Math.cos(alpha * i));
            this.normals.push(Math.sin(alpha * i));
            this.normals.push(0);

            this.texCoords.push(i / this.slices, 1 - j / this.stacks);

            if (j < this.stacks)
            {
                if (i == this.slices - 1)
                {
                    this.indices.push(0 + i + this.slices * j);
                    this.indices.push(1 + i + this.slices * (j - 1));
                    this.indices.push(1 + i + this.slices * (j));

                    this.indices.push(1 + i + this.slices * (j));
                    this.indices.push(0 + i + this.slices * (j + 1));
                    this.indices.push(0 + i + this.slices * j);
                }
                else
                {
                    this.indices.push(0 + i + this.slices * j);
                    this.indices.push(1 + i + this.slices * j);
                    this.indices.push(1 + i + this.slices * (j + 1));

                    this.indices.push(1 + i + this.slices * (j + 1));
                    this.indices.push(0 + i + this.slices * (j + 1));
                    this.indices.push(0 + i + this.slices * j);
                }
            }
        }
    }

    var lastVertex = this.slices * (this.stacks + 1);

    // Bottom cover
    
    // Circle Center
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, -1);
    this.texCoords.push(0.5, 0.5);

    for (i = 0; i < this.slices; i++)
    {
    	this.vertices.push(this.base * Math.cos(alpha * i));
    	this.vertices.push(this.base * Math.sin(alpha * i));
    	this.vertices.push(0);

    	this.normals.push(0, 0, -1);
    	
    	this.texCoords.push(0.5 * Math.cos(alpha * i) + 0.5)
    	this.texCoords.push(0.5 - 0.5 * Math.sin(alpha * i));
    	
    	if (i == this.slices - 1)
    	{
    		this.indices.push(lastVertex + i + 1);
    		this.indices.push(lastVertex + 0);
    		this.indices.push(lastVertex + 1);
    	}
    	else
    	{
    		this.indices.push(lastVertex + i + 1);
    		this.indices.push(lastVertex + 0);
    		this.indices.push(lastVertex + i + 2);
    	}
    }
    
    lastVertex += this.slices + 1;

    // Top cover
    
    // Circle Center
    this.vertices.push(0, 0, this.height);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (i = 0; i < this.slices; i++)
    {
    	this.vertices.push(this.top * Math.cos(alpha * i));
    	this.vertices.push(this.top * Math.sin(alpha * i));
    	this.vertices.push(this.height);
    	
    	this.normals.push(0, 0, 1);
    	
    	this.texCoords.push(0.5 * Math.cos(alpha * i) + 0.5)
    	this.texCoords.push(0.5 - 0.5 * Math.sin(alpha * i));
    	
    	if (i == this.slices - 1)
    	{
    		this.indices.push(lastVertex + i + 1);
    		this.indices.push(lastVertex + 1);
    		this.indices.push(lastVertex + 0);
    	}
    	else
    	{
    		this.indices.push(lastVertex + i + 1);
    		this.indices.push(lastVertex + i + 2);
    		this.indices.push(lastVertex + 0);
    	}
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
