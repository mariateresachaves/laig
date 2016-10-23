
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	  this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	  this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
  this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
	this.lights[0].enable();

	this.setAmbient(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	this.lights[1].setVisible(true);
	this.lights[1].enable();

	this.initializePrimitives();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
    this.drawComponent(this.graph.root, "inherit", "inherit");
		//this.drawComponent(this.graph.root, "inherit", "inherit");
		//this.drawPrimitive('E', null, null);
	};
};

//--- Draw Components ---
XMLscene.prototype.drawComponent = function (componentID, parentMaterial, parentTexture)
{
  if(this.graph.components[componentID].children[0].id in this.primitives ){
  	this.drawPrimitive(this.graph.components[componentID].children[0].id, this.graph.components[componentID].material, this.graph.components[componentID].texture);
    return;
 	}

	var component = this.graph.components[componentID];
	//	console.log(componentID + " " + component );

	var material = component.material;
	//console.log("material length = " + component.materials.length);

	if (material == "inherit") material = parentMaterial;

	var texture = component.texture;
	if (texture == "inherit") texture = parentTexture;

  var i = 0;

  for (; i < component.children.length; i++) {
    //console.log(component.children[i].type + " - " + component.children[i].id);
		this.drawComponent(component.children[i].id, material, texture);
	}

}

//--- Draw Primitives ---
XMLscene.prototype.drawPrimitive = function (primitiveID, parentMaterial, parentTexture)
{

  /*if(parentTexture != "none"){
  	//material.setTexture(this.textures[parentTextureID]);
  	material.loadTexture(parentTexture.file);
  }*/

  var material = new CGFappearance(this);

  if(parentMaterial != "inherit") {

    material.setEmission(parentMaterial.emission[0], parentMaterial.emission[1], parentMaterial.emission[2], parentMaterial.emission[3]);
    material.setAmbient(parentMaterial.ambient[0], parentMaterial.ambient[1], parentMaterial.ambient[2], parentMaterial.ambient[3]);
    material.setDiffuse(parentMaterial.diffuse[0], parentMaterial.diffuse[1], parentMaterial.diffuse[2], parentMaterial.diffuse[3]);
    material.setSpecular(parentMaterial.specular[0], parentMaterial.specular[1], parentMaterial.specular[2], parentMaterial.specular[3]);
    material.setShininess(parentMaterial.shininess);

    parentMaterial.apply();

  }

  if(parentTexture != "inherit" && parentTexture != "none") {

    material.loadTexture(parentTexture.file);

  }

	this.primitives[primitiveID].display();
}

//--- Iniatize Primitives ---
XMLscene.prototype.initializePrimitives = function ()
{
	this.primitives = new Object;

	for( var primitiveID in this.graph.primitives )
	{
		var p = this.graph.primitives[primitiveID];

		switch (p.type){
		case "rectangle":
			var primitive = new Rectangle(this, p.x1, p.y1, p.x2, p.y2);
			break;
		case "triangle":
			var primitive = new Triangle(this, p.x1, p.y1, p.z1, p.x2, p.y2, p.z2, p.x3, p.y3, p.z3);
			break;
		case "cylinder":
			var primitive = new Cylinder(this, p.base, p.top, p.height, p.slices, p.stacks);
			break;
		case "sphere":
			var primitive = new Sphere(this, p.radius, p.slices, p.stacks);
			break;
		case "torus":
			var primitive = new Torus(this, p.inner, p.outer, p.slices, p.loops);
			break;
		}

		this.primitives[primitiveID] = primitive;
	}
}

//--- Iniatize Textures ---
XMLscene.prototype.initializeTextures = function () {
  this.textures = new Object;

	for( var textureID in this.graph.textures )
	{
		var t = this.graph.textures[textureID];

		this.textures[textureID] = new CGFtexture(t.file);
	}
}
