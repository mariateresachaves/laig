
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.enableTextures(true);

    this.cameras = [];
    this.camera_index = 0;

    //this.initCameras();
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis=new CGFaxis(this);
};

//--- Iniatialize Cameras ---
XMLscene.prototype.initCameras = function ()
{	
	var i = 0
	for(perspective in this.graph.views.list) {
		var p = this.graph.views.list[perspective];
		
		var camera = new CGFcamera(p.angle, p.near, p.far, vec3.fromValues(p.from[0], p.from[1], p.from[2]), vec3.fromValues(p.to[0], p.to[1], p.to[2]) );
		
		this.cameras.push(camera);
		
		if (perspective === this.graph.views.default)
		{
			this.camera_index = i;
			this.camera = camera;
			this.interface.setActiveCamera(this.camera);
		}
		
		i++;
	}
};

//--- Iniatialize Lights ---
XMLscene.prototype.initLights = function ()
{
	var i = 0;
	
	for(omni in this.graph.lights.omnis)
	{
		var l = this.graph.lights.omnis[omni];

		this.lights[i].setPosition(l.location[0], l.location[1], l.location[2], l.location[3]);
		this.lights[i].setAmbient(l.ambient[0], l.ambient[1], l.ambient[2], l.ambient[3]);
		this.lights[i].setDiffuse(l.diffuse[0], l.diffuse[1], l.diffuse[2], l.diffuse[3]);
		this.lights[i].setSpecular(l.specular[0], l.specular[1], l.specular[2], l.specular[3]);
		// this.lights[i].enable();
		
	    i++;
	}
	
	for(spot in this.graph.lights.spots)
	{
		var l = this.graph.lights.spots[spot];

	    this.lights[i].setPosition(l.location[0], l.location[1], l.location[2], l.location[3]);
	    this.lights[i].setAmbient(l.ambient[0], l.ambient[1], l.ambient[2], l.ambient[3]);
	    this.lights[i].setDiffuse(l.diffuse[0], l.diffuse[1], l.diffuse[2], l.diffuse[3]);
	  	this.lights[i].setSpecular(l.specular[0], l.specular[1], l.specular[2], l.specular[3]);
	  	// this.lights[i].enable();

	    i++;
	}
};

//--- Iniatialize Primitives ---
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
	
	this.interface.onGraphLoaded();
	
	this.initLights();
	
	this.initCameras();
};

XMLscene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
};

XMLscene.prototype.changeCamera = function()
{
	this.camera_index++;
	if (this.camera_index >= this.cameras.length)
		this.camera_index = 0;
	this.camera = this.cameras[this.camera_index];
	this.interface.setActiveCamera(this.camera);
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
		
		var i = 0;
		
		for(omni in this.graph.lights.omnis) {
			if(this[omni])
				this.lights[i].enable();
			else
				this.lights[i].disable();
			i++;
		}
		for(spot in this.graph.lights.spots) {
			if(this[spot])
				this.lights[i].enable();
			else
				this.lights[i].disable();
			i++;
		}
	};
};

//--- Draw Components ---
XMLscene.prototype.drawComponent = function (componentID, parentMaterial, parentTexture)
{
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

//--- Change Materials ---
XMLscene.prototype.changeMaterials = function ()
{	
	for( var id in this.graph.components )
	{
		this.graph.components[id].nextMaterial();
	}
}
