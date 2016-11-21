/**
 * Animation
 * @constructor
 */
function Animation(scene, span)
{
	this.scene = scene;
	this.span = span;
	//this.translationMatrix = mat4.create();
	//this.rotationMatrix = mat4.create();
	this.pos = new Object;
	this.pos.x = 0;
	this.pos.y = 0;
	this.pos.z = 0;
	this.orientation = 0;
	this.ended = false;
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.update = function() { };

//Animation.prototype.getTranslationMatrix = function() { return this.translationMatrix; };

//Animation.prototype.getRotationMatrix = function() { return this.rotationMatrix; };