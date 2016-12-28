function Piece(scene, radius, height, textureTop, textureBottom) {
	CGFobject.call(this,scene);
	
	this.height = height;
	this.radius = radius;
	
	this.side = new CylinderSide(this.scene, this.radius, this.height, 20, 5);
	this.top = new Circle(this.scene, this.radius, 20);
	this.bottom = new Circle(this.scene, this.radius, 20);
	
	this.material = new CGFappearance(this.scene);
	this.material.setAmbient(1, 1, 1, 1);
	this.material.setDiffuse(1, 1, 1, 1);
	this.material.setSpecular(1, 1, 1, 1);
	this.material.setShininess(10);
	
	this.textureTop = textureTop;
	this.textureBottom = textureBottom;
};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor=Piece;

Piece.prototype.Select = function()
{
	this.tile.Select();
}

Piece.prototype.display = function () {

	this.material.apply();
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	this.side.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2, 1, 0, 0);
	
	if (this.scene.graph.loadedOk && (this.textureBottom in this.scene.graph.textures)){
		var x = this.scene.graph.textures[this.textureBottom];
		x.CGFtexture.bind();
	}
	
	this.bottom.display();
	this.scene.popMatrix();	

	this.scene.pushMatrix();
	this.scene.translate(0, this.height, 0);
	this.scene.rotate(-Math.PI/2, 1, 0, 0);

	if (this.scene.graph.loadedOk && (this.textureTop in this.scene.graph.textures)){
		var x = this.scene.graph.textures[this.textureTop];
		x.CGFtexture.bind();
	}
	
	this.top.display();
	this.scene.popMatrix();
};
