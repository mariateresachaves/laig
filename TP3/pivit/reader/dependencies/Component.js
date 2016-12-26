/**
 * Node
 * @id node's identification.
 * @constructor
 */
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

/**
 * Sets the node's texture.
 * @param texture
 */
Component.prototype.setTexture = function(t) {
	this.texture = t;
}

/**
 * Adds a material.
 * @param material
 */
Component.prototype.addMaterial = function(m) {
	this.materials.push(m);
}

/**
 * Returns the node's material.
 */
Component.prototype.getMaterial = function() {
	return this.materials[this.materialpos];
}

/**
 * Returns the node's next material.
 */
Component.prototype.nextMaterial = function() {
	this.materialpos++;
	if (this.materialpos === this.materials.length)
		this.materialpos = 0;
}

/**
 * Adds an animation to the node.
 */
Component.prototype.addAnimation = function(a) {
	this.animations.push(a);
}

/**
 * Returns the node's transformation matrix.
 */
Component.prototype.getTransformations = function() {
	//var currentTransformations = mat4.clone(this.transformations);
	var currentTransformations = mat4.create();
	mat4.identity(currentTransformations);

	var x = 0;
	var y = 0;
	var z = 0;
	var orientation = 0;
	
	for (i = 0; i < this.animations.length; i++)
	{
		if (this.animations[i].ended && i != this.animations.length - 1)
			continue;
		else
		{
			x = this.animations[i].pos.x;
			y = this.animations[i].pos.y;
			z = this.animations[i].pos.z;
			orientation = this.animations[i].orientation;
			break;			
		}	
	}
	
	mat4.translate(currentTransformations, currentTransformations, [x, y, z]);	
	mat4.rotateY(currentTransformations, currentTransformations, -orientation);
	mat4.multiply(currentTransformations, this.transformations, currentTransformations);
	
	return currentTransformations;
};

/**
 * Updates the node's transformation matrix to a given matrix.
 * @param t new node's transformation matrix.
 */
Component.prototype.setTransformations = function(t) {
	this.transformations = t;
};

/**
 * Adds a child to the node's children.
 * @param c child to add.
 */
Component.prototype.addChildren = function(c) {
	this.children.push(c);
}

/**
 * Function to update the animation.
 * @param currTime current time.
 */
Component.prototype.update = function(currTime) {
	if (this.startTime == null)
		this.startTime = currTime;
	
	var elapsedTime = (currTime - this.startTime)/1000;
	
	for (i = 0; i < this.animations.length; i++)
	{
		if (elapsedTime <= 0) break;
		
		var currAnim = this.animations[i];
		if (currAnim.ended){
			elapsedTime -= currAnim.span;
			continue;
		}
		
		elapsedTime = currAnim.update(elapsedTime);
	}
}
