/**
 * Animation
 * @constructor
 */
function Animation(scene, span)
{
	this.scene = scene;
	this.span = span;
	this.translationMatrix = mat4.create();
	this.rotationMatrix = mat4.create();
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;


Animation.prototype.update = function() { };

Animation.prototype.getTranslationMatrix = function() { return this.translationMatrix; };

Animation.prototype.getRotationMatrix = function() { return this.rotationMatrix; };