/**
 * XMLscene
 * @constructor
 */
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * init function for XMLscene.
 * @param application application
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.enableTextures(true);

    this.cameras = [];
    this.camera_index = 0;

    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

    this.surfaces = [];
    this.translations = [];

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis=new CGFaxis(this);

	var $_GET = parseUrl();
	var playerTypes = []
	for (var i = 1; i <= 4; i++){
		var player = $_GET['player' + i + '_type'];
		if (player != '-'){
			playerTypes.push(player);
		}
	}

	this.game = new Game(this, playerTypes);
	this.theme = 'default';

	this.setPickEnabled(true);
};

//--- Initialize Cameras ---

/**
 * Function to initialize the cameras.
 */
XMLscene.prototype.initCameras = function () {
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

//--- Initialize Lights ---

/**
 * Function to initialize the lights.
 */
XMLscene.prototype.initLights = function ()
{
	var i = 0;

	for(omniId in this.graph.lights.omnis)
	{
		var l = this.graph.lights.omnis[omniId];

		this.lights[i].setPosition(l.location[0], l.location[1], l.location[2], l.location[3]);
		this.lights[i].setAmbient(l.ambient[0], l.ambient[1], l.ambient[2], l.ambient[3]);
		this.lights[i].setDiffuse(l.diffuse[0], l.diffuse[1], l.diffuse[2], l.diffuse[3]);
		this.lights[i].setSpecular(l.specular[0], l.specular[1], l.specular[2], l.specular[3]);
		this.lights[i].setVisible(true);
		if (l.enabled)
			this[omniId] = true;
		else this[omniId] = false;

	    i++;
	}


	for(spotId in this.graph.lights.spots)
	{
		var l = this.graph.lights.spots[spotId];

	    this.lights[i].setPosition(l.location[0], l.location[1], l.location[2], l.location[3]);
	    this.lights[i].setAmbient(l.ambient[0], l.ambient[1], l.ambient[2], l.ambient[3]);
	    this.lights[i].setDiffuse(l.diffuse[0], l.diffuse[1], l.diffuse[2], l.diffuse[3]);
	  	this.lights[i].setSpecular(l.specular[0], l.specular[1], l.specular[2], l.specular[3]);
		this.lights[i].setSpotCutOff(l.angle);
		this.lights[i].setSpotExponent(l.exponent);
		this.lights[i].setSpotDirection(0, -1, 0);
		this.lights[i].setVisible(true);
		if (l.enabled)
			this[spotId] = true;
		else this[spotId] = false;

	    i++;
	}
};

//--- Initialize Primitives ---

/**
 * Function to initialize the primitives.
 */
XMLscene.prototype.initPrimitives = function () {
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
		case "plane":
			var primitive = new Plane(this, p.dimX, p.dimY, p.partsX, p.partsY);
			break;
		case "patch":
			var primitive = new Patch(this, p.orderU, p.orderV, p.partsU, p.partsV, p.controlPoints);
			break;
		}

		this.primitives[primitiveID] = primitive;
	}
}

//--- Set Default Appearance ---

/**
 * Function to set the default appearance.
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(1, 1, 1, 1.0);
    this.setDiffuse(1, 1, 1, 1.0);
    this.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.setShininess(10.0);
};

/**
 * Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop.
 */
XMLscene.prototype.onGraphLoaded = function () {
	this.axis = new CGFaxis(this, this.graph.axis_length);

	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);

	this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);

	this.initPrimitives();

	this.initLights();

	this.interface.onGraphLoaded();

	this.initCameras();

	this.setUpdatePeriod(1000 / 60);
};

//--- Update Lights ---

/**
 * Function to update the lights.
 */
XMLscene.prototype.updateLights = function()
{
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
};

//--- Change Camera ---

/**
 * Function to change the camera.
 */
XMLscene.prototype.changeCamera = function()
{
  this.camera_index++;
	if (this.camera_index >= this.cameras.length)
		this.camera_index = 0;

  this.init_camera = this.camera;
	this.camera = this.cameras[this.camera_index];

  var init_pos = this.init_camera.position;
  var final_pos = this.camera.position;

  var delta_x = (final_pos[0] - init_pos[0])/60;
  var delta_y = (final_pos[1] - init_pos[1])/60;
  var delta_z = (final_pos[2] - init_pos[2])/60;

  var x=init_pos[0];
  var y=init_pos[1];
  var z=init_pos[2];

  console.log("INITIAL POSITION");

  console.log("x = " + x);
  console.log("y = " + y);
  console.log("z = " + z);

  console.log("delta x = " + delta_x);
  console.log("delta y = " + delta_y);
  console.log("delta z = " + delta_z);

  console.log("FINAL POSITION");

  console.log("x = " + final_pos[0]);
  console.log("y = " + final_pos[1]);
  console.log("z = " + final_pos[2]);


  var camera_tmp;
  var flag = true;
  console.log("Conditions: ");
  console.log("x: " + x!=final_pos[0]);
  console.log("y: " + y!=final_pos[1]);
  console.log("z: " + z!=final_pos[2]);

  while(flag) {
    if (x==final_pos[0] && y==final_pos[1] && z==final_pos[2])
      flag = false;

    if (x!=final_pos[0]) {
      x+=delta_x;
    }
    if (y!=final_pos[1]) {
      y+=delta_y;
    }
    if (z!=final_pos[2]) {
      z+=delta_z;
    }

    camera_tmp = new CGFcamera(this.camera.fov, this.camera.near, this.camera.far, vec3.fromValues(x, y, z), this.camera.target);

    //sleep(1);

    this.interface.setActiveCamera(camera_tmp);
  }

	this.interface.setActiveCamera(this.camera);
};

//--- Display Scene ---
/**
 * display function of the scene.
 */
XMLscene.prototype.display = function ()
{
	this.logPicking();
	this.clearPickRegistration();

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
		this.drawComponent(this.graph.root, "inherit", "inherit");

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
	}
};

//--- Draw Components ---

/**
 * Function to draw components.
 * @param componentID component identification.
 * @param parentMaterial component parent material.
 * @param parentTexture component parent texture.
 */
XMLscene.prototype.drawComponent = function (componentID, parentMaterial, parentTexture) {
	var component = this.graph.components[componentID];

	var material = component.getMaterial();
	if (material == "inherit") material = parentMaterial;

	var texture = component.texture;
	if (texture == "inherit") texture = parentTexture;

	this.pushMatrix();
	this.multMatrix( component.getTransformations() );

	for (var i = 0; i < component.children.length; i++)
	{
		if (component.children[i].type === "component")
			this.drawComponent(component.children[i].id, material, texture);
		else if (component.children[i].type === "primitive")
			this.drawPrimitive(component.children[i].id, material, texture);
		else if (component.children[i].type === "gameboard")
			this.game.gameboard.display(texture.CGFtexture);
		else if (component.children[i].type === "auxiliaryboard")
			this.game.auxboard.display(texture.CGFtexture);
	}

	this.popMatrix();
}

//--- Draw Primitives ---

/**
 * Function to draw a primitive.
 * @param primitiveID primitive identification.
 * @param parentMaterial primitive parent material.
 * @param parentTexture primitive parent texture.
 */
XMLscene.prototype.drawPrimitive = function (primitiveID, parentMaterial, parentTexture) {
	if(parentTexture == "none")
	{
		parentMaterial.setTexture(null);
	}
	else
	{
		parentMaterial.setTexture(parentTexture.CGFtexture);

		var type = this.graph.primitives[primitiveID].type;
		if (type == "rectangle" || type == "triangle" )
			this.primitives[primitiveID].setTextureScales(parentTexture.length_s, parentTexture.length_t);
	}

	parentMaterial.apply();

	this.primitives[primitiveID].display();
}

//--- Change Materials ---

/**
 * Function to change the materials.
 */
XMLscene.prototype.changeMaterials = function () {
	for( var id in this.graph.components )
	{
		this.graph.components[id].nextMaterial();
	}
}

//--- Update Animations ---

/**
 * Function to update the animation.
 * @param currTime current time.
 */
XMLscene.prototype.update = function (currTime) {
	for( var id in this.graph.components )
	{
		this.graph.components[id].update(currTime);
	}
	this.game.update(currTime);
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i = 0; i < this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					obj.selected();
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

function parseUrl()
{
	var $_GET = new Object;
	if(document.location.toString().indexOf('?') !== -1) {
		var query = document.location.toString().replace(/^.*?\?/, '').replace(/#.*$/, '').split('&');

		for(var i = 0; i < query.length; i++) {
			var aux = decodeURIComponent(query[i]).split('=');
			$_GET[aux[0]] = aux[1];
		}
	}
	return $_GET;
}
