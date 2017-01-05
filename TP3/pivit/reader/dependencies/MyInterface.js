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


};

/**
 * init
 * @param application application
 * @returns {boolean}
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	var playOptions = this.gui.addFolder("Play options");
	playOptions.open();
	playOptions.add(this.scene.game, 'undo');
	playOptions.add(this.scene.game, 'replay');
	
	this.gui.add( { mainmenu: function(){ window.location.href = 'index.html'; } }, 'mainmenu');	
	
	var changeThemeFunction = function(value){ this.scene.graph = new MySceneGraph(value + '.dsx', this.scene); };
	var theme = this.gui.add(this.scene, 'theme', ['default', 'tvroom', 'swimmingpool']);	
	theme.onFinishChange(changeThemeFunction.bind(this));
	
	return true;
};

/**
 * Function to process a key event.
 * @param event key event.
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
