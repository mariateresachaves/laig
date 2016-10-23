
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.enableTextures(true);

    this.initCameras();

    this.myInterface = new MyInterface();

    this.LUZ_0=true;
    this.LUZ_1=true;
    this.LUZ_2=true;
    this.LUZ_3=true;

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function ()
{
	this.lights[0].setPosition(2, 3, 3, 1);
	this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
	this.lights[0].update();
  /*
  this.shader.bind();

  for(omniID in this.graph.lights.omnis) {

  }

	// Positions for four lights
	//this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[0].setPosition(0, 4.0, 7.5, 1.0);
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
	this.lights[3].setPosition(4, 6.0, 5.0, 1.0);

	// -------------------------lights[0]------------------------------------

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1.0, 1.0, 0, 1.0);
	this.lights[0].enable();


	// --------------------------lights[1]-----------------------------------

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();

	// --------------------------lights[2]-----------------------------------

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	//Kc=0, Kl=1, Kq=0
	this.lights[2].setConstantAttenuation(0); 	// -> kc
	this.lights[2].setLinearAttenuation(1); 	// -> kl
	this.lights[2].setQuadraticAttenuation(0); 	// -> kq
	this.lights[2].enable();

	// --------------------------lights[3]-----------------------------------

	this.lights[3].setAmbient(0, 0, 0, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setSpecular(1.0, 1.0, 0, 1.0);
	//Kc=0, Kl=0, Kq=1
	this.lights[3].setConstantAttenuation(0); 		// -> kc
	this.lights[3].setLinearAttenuation(0); 		// -> kl
	this.lights[3].setQuadraticAttenuation(1); 		// -> kq
	this.lights[3].enable();

	this.shader.unbind();
  */
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
  this.axis = new CGFaxis(this, this.graph.axis_length);

	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
	this.lights[0].enable();

	this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	this.lights[1].setVisible(true);
	this.lights[1].enable();

	this.initializePrimitives();

  for(l_o in this.graph.lights.omnis)
    this[l_o] = true;

  for(l_s in this.graph.lights.spots)
    this[l_s] = true;

  this.myInterface.onGraphLoaded();
};

XMLscene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
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

  this.updateLights();

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
		//this.drawComponent(this.graph.root, null, null);
		this.drawComponent(this.graph.root, "inherit", "inherit");
		//this.drawPrimitive('E', null, null);
	};
};

//--- Draw Components ---
XMLscene.prototype.drawComponent = function (componentID, parentMaterial, parentTexture)
{
	/*if(this.graph.components[componentID].children[0].id in this.primitives ){
		this.drawPrimitive(this.graph.components[componentID].children[0].id, this.graph.components[componentID].material, this.graph.components[componentID].texture);
		return;
 	}*/

	var component = this.graph.components[componentID];

	var material = component.getMaterial();
	if (material == "inherit") material = parentMaterial;

	var texture = component.texture;
	if (texture == "inherit") texture = parentTexture;

	this.pushMatrix();
	this.multMatrix(component.transformations);

	for (var i = 0; i < component.children.length; i++)
	{
		if (component.children[i].type === "component")
			this.drawComponent(component.children[i].id, material, texture);
		else
			this.drawPrimitive(component.children[i].id, material, texture);
	}

	this.popMatrix();
}

//--- Draw Primitives ---
XMLscene.prototype.drawPrimitive = function (primitiveID, parentMaterial, parentTexture)
{
	if(parentTexture == "none")
	{
		parentMaterial.setTexture(null);
		//parentMaterial.setTextureWrap('REPEAT', 'REPEAT');
	}
	else
	{
		parentMaterial.setTexture(parentTexture);
		//parentMaterial.setTextureWrap('REPEAT', 'REPEAT');
	}

	parentMaterial.apply();

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
