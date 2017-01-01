/**
 * Animation
 * @param span animation's duration.
 * @constructor
 */
function Animation(scene, span) {
	this.scene = scene;
	this.span = span;

	this.startTime;
	this.pos = new Object;
	this.pos.x = 0;
	this.pos.y = 0;
	this.pos.z = 0;
	this.orientation = 0;
	this.ended = false;
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.reset = function() {
	this.startTime = null;
	this.ended = false;
};

Animation.prototype.update = function() { };