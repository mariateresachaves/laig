function Node(id, scene) {
  this.id = id;
  this.scene = scene;
  this.texture = "none";
  this.materials = [];
  this.materialpos = 0;
  this.transformations = mat4.create();
  mat4.identity(this.transformations);
  this.children = [];
}

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

Node.prototype.setTexture = function(t)
{
	this.texture = t;
}

Node.prototype.addMaterial = function(m)
{
	this.materials.push(m);
}

Node.prototype.getMaterial = function()
{
	return this.materials[this.materialpos];
}

Node.prototype.nextMaterial = function()
{
	this.materialpos++;
	if (this.materialpos === this.materials.length)
		this.materialpos = 0;
}

Node.prototype.setTransformations = function(t)
{
	this.transformations = t;
};

Node.prototype.addChildren = function(c)
{
  this.children.push(c);
}
