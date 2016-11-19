function Component(id, scene) {
  this.id = id;
  this.scene = scene;
  this.texture = "none";
  this.materials = [];
  this.materialpos = 0;
  this.transformations = mat4.create();
  mat4.identity(this.transformations);
  this.animations = [];
  this.children = [];
}

Component.prototype = Object.create(Object.prototype);
Component.prototype.constructor = Node;

Component.prototype.setTexture = function(t)
{
	this.texture = t;
}

Component.prototype.addMaterial = function(m)
{
	this.materials.push(m);
}

Component.prototype.getMaterial = function()
{
	return this.materials[this.materialpos];
}

Component.prototype.nextMaterial = function()
{
	this.materialpos++;
	if (this.materialpos === this.materials.length)
		this.materialpos = 0;
}

Component.prototype.addAnimation = function(a)
{
	this.animations.push(a);
}

Component.prototype.getTransformations = function(t)
{
	var currentTransformations = mat4.clone(this.transformations);
	
	//apply animation orientation
	for (i = 0; i < this.animations.length; i++)
	{
		mat4.multiply(currentTransformations, currentTransformations, this.animations[i].getRotationMatrix());		
	}
	//apply animation translations
	for (i = 0; i < this.animations.length; i++)
	{
		mat4.multiply(currentTransformations, this.animations[i].getTranslationMatrix(), currentTransformations);		
	}
	
	return currentTransformations;
};

Component.prototype.setTransformations = function(t)
{
	this.transformations = t;
};

Component.prototype.addChildren = function(c)
{
	this.children.push(c);
}
