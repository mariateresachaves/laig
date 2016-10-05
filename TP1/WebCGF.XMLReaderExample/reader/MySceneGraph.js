
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

	// --- Parse Illumination ---
	error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Lights ---
	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}



	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

// --- Parse Scene ---
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

	console.log("Scene read from file: {root=" + this.root + ", axis_length=" + this.axis_length + "}");

}

// --- Parse Views ---
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

// --- Parse Illumination ---
MySceneGraph.prototype.parseIllumination = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) { // errro não existe um illumination - reporta e termina
		return "illumination element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um illumination - reporta e termina
		return "either zero or more than one 'illumination' element found.";
	}

	// various examples of different types of access
	var illumination = elems[0];
	this.doublesided = this.reader.getString(illumination, 'doublesided');
	this.local = this.reader.getString(illumination, 'local');

	var illumination_ambient = illumination.children[0];
	var r = this.reader.getFloat(illumination_ambient, 'r');
	var g = this.reader.getFloat(illumination_ambient, 'g');
	var b = this.reader.getFloat(illumination_ambient, 'b');
	var a = this.reader.getFloat(illumination_ambient, 'a');

	illumination.ambient = [r,g,b,a];

	var illumination_background = illumination.children[1];
	var r = this.reader.getFloat(illumination_background, 'r');
	var g = this.reader.getFloat(illumination_background, 'g');
	var b = this.reader.getFloat(illumination_background, 'b');
	var a = this.reader.getFloat(illumination_background, 'a');

	illumination.background = [r,g,b,a];

	console.log("Illumination read from file: {doublesided=" + this.doublesided + ", local=" + this.local + "}");

	console.log("ambient = [ " + illumination.ambient + "] " +
							"background = ["+ illumination.background + "] ");

}

// --- Parse Lights ---
MySceneGraph.prototype.parseLights = function(rootElement) {

	var exists_one = 0;

	var elems =  rootElement.getElementsByTagName('lights');

	if (elems == null) { // errro não existe um lights - reporta e termina
		return "lights element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um lights - reporta e termina
		return "lights zero or more than one 'lights' element found.";
	}

	var lights = elems[0];

	var omnis = lights.getElementsByTagName('omni');
	var spots = lights.getElementsByTagName('spot');

	if(omnis.length != 0) { // tem omnis

		exists_one = 1;

		// iterate over every element
		var n_omnis = omnis.length;

		for (var i = 0; i < n_omnis; i++)
		{

			var omni = omnis[i];
			omnis[i].enabled = this.reader.getString(omni, 'enabled');

			var omnis_location = omnis[i].children[0];
			var x = this.reader.getFloat(omnis_location, 'x');
			var y = this.reader.getFloat(omnis_location, 'y');
			var z = this.reader.getFloat(omnis_location, 'z');
			var w = this.reader.getFloat(omnis_location, 'w');

			omnis[i].location = [x,y,z,w];

			var omnis_ambient = omnis[i].children[1];
			var r = this.reader.getFloat(omnis_ambient, 'r');
			var g = this.reader.getFloat(omnis_ambient, 'g');
			var b = this.reader.getFloat(omnis_ambient, 'b');
			var a = this.reader.getFloat(omnis_ambient, 'a');

			omnis[i].ambient = [r,g,b,a];

			var omnis_diffuse = omnis[i].children[2];
			r = this.reader.getFloat(omnis_diffuse, 'r');
			g = this.reader.getFloat(omnis_diffuse, 'g');
			b = this.reader.getFloat(omnis_diffuse, 'b');
			a = this.reader.getFloat(omnis_diffuse, 'a');

			omnis[i].diffuse = [r,g,b,a];

			var omnis_specular = omnis[i].children[3];
			r = this.reader.getFloat(omnis_specular, 'r');
			g = this.reader.getFloat(omnis_specular, 'g');
			b = this.reader.getFloat(omnis_specular, 'b');
			a = this.reader.getFloat(omnis_specular, 'a');

			omnis[i].specular = [r,g,b,a];

			console.log("Read omni item id " + omnis[i].id + " (enabled = " + omnis[i].enabled + ")" +
									" location = [" + omnis[i].location + "]" +
									" ambient = " + omnis[i].ambient + "]" +
									" diffuse = " + omnis[i].diffuse + "]" +
									" specular = " + omnis[i].specular + "]");

		}

	}

	if (spots.length != 0){

		exists_one = 1;

		// iterate over every element
		var n_spots = spots.length;

		for (var i = 0; i < n_spots; i++)
		{

			var spot = spots[i];
			spots[i].enabled = this.reader.getString(spot, 'enabled');
			spots[i].angle = this.reader.getFloat(spot, 'angle');
			spots[i].exponent = this.reader.getFloat(spot, 'exponent');

			var spots_target = spots[i].children[0];
			var x = this.reader.getFloat(spots_target, 'x');
			var y = this.reader.getFloat(spots_target, 'y');
			var z = this.reader.getFloat(spots_target, 'z');

			spots[i].target = [x,y,z];

			var spots_location = spots[i].children[1];
			x = this.reader.getFloat(spots_location, 'x');
			y = this.reader.getFloat(spots_location, 'y');
			z = this.reader.getFloat(spots_location, 'z');

			spots[i].location = [x,y,z];

			var spots_ambient = spots[i].children[2];
			var r = this.reader.getFloat(spots_ambient, 'r');
			var g = this.reader.getFloat(spots_ambient, 'g');
			var b = this.reader.getFloat(spots_ambient, 'b');
			var a = this.reader.getFloat(spots_ambient, 'a');

			spots[i].ambient = [r,g,b,a];

			var spots_diffuse = spots[i].children[3];
			r = this.reader.getFloat(spots_diffuse, 'r');
			g = this.reader.getFloat(spots_diffuse, 'g');
			b = this.reader.getFloat(spots_diffuse, 'b');
			a = this.reader.getFloat(spots_diffuse, 'a');

			spots[i].diffuse = [r,g,b,a];

			var spots_specular = spots[i].children[4];
			r = this.reader.getFloat(spots_specular, 'r');
			g = this.reader.getFloat(spots_specular, 'g');
			b = this.reader.getFloat(spots_specular, 'b');
			a = this.reader.getFloat(spots_specular, 'a');

			spots[i].specular = [r,g,b,a];

			console.log("Read spot item id " + spots[i].id + " (enabled = " + spots[i].enabled + ")" +
									" target = [" + spots[i].target + "]" +
									" location = [" + spots[i].location + "]" +
									" ambient = " + spots[i].ambient + "]" +
									" diffuse = " + spots[i].diffuse + "]" +
									" specular = " + spots[i].specular + "]");

		}
	}

	if (exists_one == 0)
		return "Needs at least one omni or spot light.";

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
