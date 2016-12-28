/**
 * CylinderSide
 * @param base base dimension.
 * @param top top dimension.
 * @param height cylinder height.
 * @param slices number of slices.
 * @param stacks number of stack.
 * @constructor
 */
function CylinderSide(scene, radius, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.height = height;
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

CylinderSide.prototype = Object.create(CGFobject.prototype);
CylinderSide.prototype.constructor = CylinderSide;

/**
 * initBuffers
 */
CylinderSide.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var alpha = 2 * Math.PI / this.slices;

    for (j = 0; j <= this.stacks; j++)
    {    	
        for (i = 0; i < this.slices; i++)
        {
            this.vertices.push(this.radius * Math.cos(alpha * i));
            this.vertices.push(this.radius * Math.sin(alpha * i));
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

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
