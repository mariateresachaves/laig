
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
	};
};

//--- Draw Components ---
XMLscene.prototype.drawComponent = function (componentID, parentMaterialID, parentTextureID)
{
	var component = this.graph.components[componentID];
	
	var materialID = component.materials[0];
	if (materialID == "inherit") materialID = parentMaterialID;
	
	var textureID = component.texture;
	if (textureID == "inherit") textureID = parentTextureID;
	
	for (i = 0; i < component.children.length; i++)
	{
		if (component.children[i].type == "component")
			this.drawComponent(component.children[i], materialID, textureID);
		else
			this.drawPrimitive(component.children[i], materialID, textureID);
	}
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
			var primitive = new Rectangle(this.scene, p.x1, p.y1, p.x2, p.y2);
			break;
		case "triangle":
			var primitive = new Triangle(this.scene, p.x1, p.y1, p.z1, p.x2, p.y2, p.z2, p.x3, p.y3, p.z3);
			break;
		case "cylinder":
			var primitive = new Cylinder(this.scene, p.base, p.top, p.height, p.slices, p.stacks);
			break;
		case "sphere":
			var primitive = new Sphere(this.scene, p.radius, p.slices, p.stacks);
			break;
		case "torus":
			var primitive = new Torus(this.scene, p.inner, p.outer, p.slices, p.loops);
			break;
		}
		
		this.primitives[primitiveID] = primitive;
	}
}

//--- Draw Primitives ---
XMLscene.prototype.drawPrimitive = function (primitiveID, parentMaterial, parentTexture)
{
	var primitive = this.primitives[primitiveID];
	primitive.display();
}
