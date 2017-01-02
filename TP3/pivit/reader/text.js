/**
 * Text constructor.
 * @constructor
 * @param scene {CGFscene} scene this marker belongs to.
 */
function Text(scene) {
	CGFobject.call(this, scene);
	if (!Text.shaderInitialized) {
		Text.initializeShader(scene);
	}
	this.plane = new Plane(this.scene, 1, 1, 100,  100);
	this.setText("");
}

Text.prototype = Object.create(CGFobject.prototype);
Text.prototype.constructor = Text;

Text.shaderInitialized = false;

/**
 * Initialize marker shader.
 * @param scene {CGFscene} scene linked to marker shader.
 */
Text.initializeShader = function(scene) {
	Text.shader = new CGFshader(scene.gl, "shaders/font.vert", "shaders/font.frag");
	Text.shader.setUniformsValues({'dims': [16, 16]});
	Text.fontTexture = new CGFtexture(scene, "fonts/font.png");
	Text.shaderInitialized = true;
}

/**
 * Set marker text.
 * @param string {String} marker text.
 */
Text.prototype.setText = function(string) {
	this.string = string;
}

/**
 * Map character to font coordinates.
 * @param c {Character} character to map
 * @return {Array(2)} font coordinates.
 */
Text.prototype.charToCoords = function(c){
	var pos = c.charCodeAt();
	return [pos%16,Math.trunc(pos/16)];
}

/**
 * Display marker.
 */
Text.prototype.display = function(){
	var currShader = this.scene.activeShader;
	this.scene.setActiveShaderSimple(Text.shader);

	this.scene.pushMatrix();
	Text.fontTexture.bind();
	this.scene.translate(-(this.string.length - 1)/2, 0,0);
	this.scene.rotate(Math.PI,1,0,0);
	this.scene.rotate(Math.PI/2,0,1,0);
	for(var c = 0; c < this.string.length; ++c){
		var pos = this.charToCoords(this.string[c]);
		this.scene.activeShader.setUniformsValues({'charCoords': pos});
		this.plane.display();
		this.scene.translate(1,0,0);
	}
	Text.fontTexture.unbind();
	this.scene.popMatrix();
	this.scene.setActiveShaderSimple(currShader);
}
