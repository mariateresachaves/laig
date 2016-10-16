/**
 * MyTriangle
 * @constructor
 */
 function MyTorus(scene, r_inner, r_outer, slices, loops) {
 	CGFobject.call(this,scene);

  this.r_inner = r_inner;
  this.r_outer = r_outer;
  this.slices = slices;
  this.loops = loops;

 	this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {
  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.texCoords = [];

  var r_alpha = 2 * Math.PI / this.slices;
  var h_alpha = 2 * Math.PI / this.loops;
  var current_rotation = 0;
  var current_loop, r, normals_dist;

  for(i = 0; i < this.slices + 1; i++) {
    current_loop = 0;

    for(j = 0; j < this.loops + 1; j++) {
      r = this.r_outer+this.r_inner*Math.cos(current_loop);

      normals_dist = Math.sqrt(Math.pow(Math.cos(current_rotation)*Math.cos(current_loop), 2)+
                               Math.pow(Math.sin(current_rotation)*Math.cos(current_loop), 2)+
                               Math.pow(Math.sin(current_loop), 2));

      // Normals
      this.normals.push(Math.cos(current_rotation)*Math.cos(current_loop)/normals_dist);
 			this.normals.push(Math.sin(current_rotation)*Math.cos(current_loop)/normals_dist);
 			this.normals.push(Math.sin(current_loop)/normals_dist);

      // Vertices
      this.vertices.push(r*Math.cos(current_rotation));
      this.vertices.push(r*Math.sin(current_rotation));
      this.vertices.push(this.r_inner*Math.sin(current_loop));

      // Textures
      this.texCoords.push(i/this.slices, j/this.loops);

      // Indices
      if(i > 0 && j > 0)
			{
				this.indices.push((this.slices+1)*(i)+(j),(this.slices+1)*(i)+(j-1),(this.slices+1)*(i-1)+(j-1));
				this.indices.push((this.slices+1)*(i)+(j),(this.slices+1)*(i-1)+(j-1),(this.slices+1)*(i-1)+(j));
			}

    }
  }


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
