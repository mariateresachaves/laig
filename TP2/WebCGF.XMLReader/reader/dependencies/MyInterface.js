/**
 * MyInterface
 * @constructor
 */
function MyInterface(scene) {
	//call CGFinterface constructor
	CGFinterface.call(this);
	
	this.scene = scene;
	scene.interface = this;
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.onGraphLoaded = function ()
{
	this.gui = new dat.GUI();
	
	this.group_1 = this.gui.addFolder("Omni Lights");
	this.group_1.open();
	for(omniID in this.scene.graph.lights.omnis)
		this.group_1.add(this.scene, omniID);
	
	this.group_2 = this.gui.addFolder("Spot Lights");
	this.group_2.open();
	for(spotID in this.scene.graph.lights.spots)
		this.group_2.add(this.scene, spotID);
};

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	return true;
};

/**
 * processKeyUp
 * @param event {Event}
 */
MyInterface.prototype.processKeyUp = function(event)
{
	switch (event.which || event.keyCode)
	{
		case (MyInterface.Keys.KEY_M):
			this.scene.changeMaterials();
			break;
		case (MyInterface.Keys.KEY_V):
			this.scene.changeCamera();
			break;
	};
};

MyInterface.prototype.processKeyDown = function(event) { };

MyInterface.prototype.processKeyboard = function(event) { }

MyInterface.Keys =
{
	KEY_M : 77,	//M
	KEY_V : 86	//L
};
