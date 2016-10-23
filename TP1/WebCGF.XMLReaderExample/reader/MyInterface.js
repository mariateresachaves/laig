/**
 * MyInterface
 * @constructor
 */


function MyInterface(scene) {
	this.scene = scene;

	//call CGFinterface constructor
	CGFinterface.call(this);

	this.gui = new dat.GUI();
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.onGraphLoaded = function () {

  var group_1 = this.gui.addFolder("Omni Lights");
	group_1.open();

  for(omniID in this.scene.graph.lights.omnis)
    group_1.add(this.scene, omniID);

  var group_2 = this.gui.addFolder("Spot Lights");
  group_2.open();

  for(spotID in this.scene.graph.lights.spots)
    group_2.add(this.scene, spotID);

};


/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// TESTE

	var group=this.gui.addFolder("Luzes");
	group.open();

	group.add(this.scene, 'LUZ_1');
	group.add(this.scene, 'LUZ_2');
	group.add(this.scene, 'LUZ_3');

	return true;
};
