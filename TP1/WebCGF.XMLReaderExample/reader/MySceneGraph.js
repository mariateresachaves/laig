
function MySceneGraph(filename, scene) { // filename: path
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader(); // ferramenta que le o ficheiro xml

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this); // abre o ficheiro xml

	// aqui estamos em condicoes de intrepertar o ficheiro
	// aqui temos de fazer o parse do ficheiro
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	//var error = this.parseGlobalsExample(rootElement);

	// --- Parse Scene ----
	var error = this.parseScene(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Views ---
	error = this.parseViews(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

// --- Parse Scene ----
MySceneGraph.prototype.parseScene = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) { // errro não existe um scene - reporta e termina
		return "scene element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um scene - reporta e termina
		return "either zero or more than one 'scene' element found.";
	}

	// various examples of different types of access
	var scene = elems[0];
	this.root = this.reader.getString(scene, 'root');
	this.axis_length = this.reader.getFloat(scene, 'axis_length');

	console.log("Scene read from file: {root=" + this.root + "axis_length=" + this.axis_length + "}");

}

// --- Parse Views ----
MySceneGraph.prototype.parseViews = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('views');

	if (elems == null) { // errro não existe um scene - reporta e termina
		return "views element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um scene - reporta e termina
		return "views zero or more than one 'views' element found.";
	}

	// various examples of different types of access
	var views = elems[0];
	this.default = this.reader.getString(views, 'default');

	console.log("Views read from file: {default=" + this.default + "}");

	views.list = [];

	// iterate over every element
	var nnodes = views.children.length;

	if(nnodes < 1)
		return "perspective element is missing.";

	for (var i = 0; i < nnodes; i++)
	{
		var e = views.children[i];

		console.log("NEAR: " + e.attributes.getNamedItem("near").value);

		// process each element and store its information
		var perspective_attr = new Object;

		perspective_attr.near = e.attributes.getNamedItem("near").value;
		perspective_attr.far = e.attributes.getNamedItem("far").value;
		perspective_attr.angle = e.attributes.getNamedItem("angle").value;

		var nnnodes = e.children.length;

		if(nnnodes != 2)
			return " missing from and to elements.";

		var perspective_from = e.children[0];
		var x = this.reader.getFloat(perspective_from, 'x');
		var y = this.reader.getFloat(perspective_from, 'y');
		var z = this.reader.getFloat(perspective_from, 'z');

		perspective_attr.from = [x,y,z];

		var perspective_to = e.children[1];
		x = this.reader.getFloat(perspective_to, 'x');
		y = this.reader.getFloat(perspective_to, 'y');
		z = this.reader.getFloat(perspective_to, 'z');

		perspective_attr.to = [x,y,z];

		console.log("Read views item id " + e.id +
								" near = " + perspective_attr.near +
								" far = " + perspective_attr.far +
								" angle = " + perspective_attr.angle);

		console.log("from = [ " + perspective_attr.from + "] " +
								"to = ["+ perspective_attr.to + "] ");

		views.list[e.id] = perspective_attr;
	}
}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) { // errro não existe um globals - reporta e termina
		return "globals element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um globals - reporta e termina
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
