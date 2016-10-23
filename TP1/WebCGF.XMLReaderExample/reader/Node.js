function Node(id, scene) {
  this.id = id;
  this.scene = scene;
  this.texture = "none";
  this.materials = [];
  this.material;
  this.transformations = mat4.create();
  mat4.identity(this.transformations);
  this.children = [];
}

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

Node.prototype.setTexture = function(t) {
  this.texture = t;
}

Node.prototype.addMaterial = function(m)
{
	if (m == "inherit")
		this.materials.push(m);
	else{
		var material = new CGFappearance(this.scene);
		material.setEmission(m.emission[0], m.emission[1], m.emission[2], m.emission[3]);
		material.setAmbient(m.ambient[0], m.ambient[1], m.ambient[2], m.ambient[3]);
		material.setDiffuse(m.diffuse[0], m.diffuse[1], m.diffuse[2], m.diffuse[3]);
		material.setSpecular(m.specular[0], m.specular[1], m.specular[2], m.specular[3]);
		material.setShininess(m.shininess);
		this.materials.push(material);
	}
	this.material = this.materials[0];
}

Node.prototype.setTransformations = function (t) {
  this.transformations = t;
};

Node.prototype.addChildren = function(c) {
  this.children.push(c);
}
