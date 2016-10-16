function Node(id) {
  this.id = id;
  this.texture = "none";
  this.materials = [];
  this.transformations = mat4.create();
  mat4.identity(this.transformations);
  this.children = [];
}

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

Node.prototype.setTexture = function(t) {
  this.texture = t;
}

Node.prototype.addMaterial = function(m) {
  this.materials.push(m);
}

Node.prototype.setTransformations = function (t) {
  this.transformations = t;
};

Node.prototype.addChildren = function(c) {
  this.children.push(c);
}
