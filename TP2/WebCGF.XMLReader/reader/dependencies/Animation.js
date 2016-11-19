/**
 * Animation
 * @constructor
 */
function Animation(scene, span)
{
	this.scene = scene;
	this.span = span;
	this.matrix = mat4.create();
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;


Animation.prototype.update = function() { };

Animation.prototype.getMatrix = function() { return this.matrix; };