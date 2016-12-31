function Piece(scene, radius, height, textureMinion, textureMaster, owner, tile, orientation) {
	CGFobject.call(this,scene);
	
	this.owner = owner;
	this.type = 'minion';
	this.orientation = orientation;
	this.tile = tile;
	
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
	
	this.textureMinion = textureMinion;
	this.textureMaster = textureMaster;
	
	this.animationX = 0;
	this.animationY = 0;
	this.animationZ = 0;
	this.animationXAngle = 0;
	this.animationYAngle = 0;
};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor=Piece;

Piece.prototype.selected = function()
{
	this.tile.selected();
}

Piece.prototype.changeOrientation = function()
{
	if(this.orientation == 'v')
		this.orientation = 'h';
	else
		this.orientation = 'v';
}

Piece.prototype.display = function () {

	this.scene.pushMatrix();
	
		this.scene.translate(this.tile.x + this.animationX, this.animationY, this.tile.z + this.animationZ);
		this.scene.rotate(this.animationYAngle, 0, 1, 0);
		this.scene.rotate(this.animationXAngle, 1, 0, 0);
		
		if (this.type != 'minion'){
			this.scene.translate(0, this.height, 0);
			this.scene.rotate(Math.PI, 1, 0, 0);			
		}
		
		if (this.orientation == 'v')
			this.scene.rotate(Math.PI/2, 0, 1, 0);
		
		this.material.apply();
	
		//cilindrical side
		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.side.display();
		this.scene.popMatrix();
	
		//bottom
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2, 1, 0, 0);
	
			if (this.scene.graph.loadedOk && (this.textureMaster in this.scene.graph.textures)){
				var x = this.scene.graph.textures[this.textureMaster];
				x.CGFtexture.bind();
			}
	
			this.bottom.display();
		this.scene.popMatrix();	

		//top
		this.scene.pushMatrix();
			this.scene.translate(0, this.height, 0);
			this.scene.rotate(-Math.PI/2, 1, 0, 0);

			if (this.scene.graph.loadedOk && (this.textureMinion in this.scene.graph.textures)){
				var x = this.scene.graph.textures[this.textureMinion];
				x.CGFtexture.bind();
			}
	
			this.top.display();
		this.scene.popMatrix();
	
	this.scene.popMatrix();
};
