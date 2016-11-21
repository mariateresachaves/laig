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

/**
 * Function to create the lights groups.
 */
MyInterface.prototype.onGraphLoaded = function () {
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
 * @param application application
 * @returns {boolean}
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	return true;
};

/**
 * Function to process a key event.
 * @param event key event.
 */
MyInterface.prototype.processKeyUp = function(event) {
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

/**
 * Function to process the event of a key down.
 * @param event key event.
 */
MyInterface.prototype.processKeyDown = function(event) { };

/**
 * Function to process the keyboard.
 * @param event key event.
 */
MyInterface.prototype.processKeyboard = function(event) { };

/**
 * Codes of the keys
 * @type {{KEY_M: number, KEY_V: number}}
 */
MyInterface.Keys = {
	KEY_M : 77,	//M
	KEY_V : 86	//L
};
