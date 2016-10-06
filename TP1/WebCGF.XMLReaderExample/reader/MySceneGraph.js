
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

	// --- Parse Textures ---
	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Textures ---
	error = this.parseMaterials(rootElement);

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
	this.views = new Object;
	this.views.default = this.reader.getString(views, 'default');

	console.log("Views read from file: {default=" + this.views.default + "}");

	this.views.list = [];

	// iterate over every element
	var nnodes = views.children.length;
	var e = views.getElementsByTagName('perspective');

	if(nnodes != e.length) {
		return "Not perspective elements found.";
	}

	if(e.length < 1)
		return "perspective element is missing.";

	for (var i = 0; i < e.length; i++)
	{
		// process each element and store its information
		var perspective_attr = new Object;

		perspective_attr.near = e[i].attributes.getNamedItem("near").value;
		perspective_attr.far = e[i].attributes.getNamedItem("far").value;
		perspective_attr.angle = e[i].attributes.getNamedItem("angle").value;

		var e_from = e[i].getElementsByTagName('from');
		var e_to = e[i].getElementsByTagName('to');

		if(e_from.length != 1 && e_to.length != 1)
			return " missing from and/or to elements.";

		var perspective_from = e_from[0];
		var x = this.reader.getFloat(perspective_from, 'x');
		var y = this.reader.getFloat(perspective_from, 'y');
		var z = this.reader.getFloat(perspective_from, 'z');

		perspective_attr.from = [x,y,z];

		var perspective_to = e_to[0];
		x = this.reader.getFloat(perspective_to, 'x');
		y = this.reader.getFloat(perspective_to, 'y');
		z = this.reader.getFloat(perspective_to, 'z');

		perspective_attr.to = [x,y,z];

		this.views.list.push(perspective_attr);
	}

	for(i = 0; i < this.views.list.length; i++) {
		console.log("Read views item id " + this.views.list[i].id +
								" near = " + this.views.list[i].near +
								" far = " + this.views.list[i].far +
								" angle = " + this.views.list[i].angle);

		console.log("from = [ " + this.views.list[i].from + "] " +
								"to = ["+ this.views.list[i].to + "] ");
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

	this.illumination = new Object;

	this.illumination.doublesided = this.reader.getInteger(illumination, 'doublesided');
	this.illumination.local = this.reader.getInteger(illumination, 'local');

	elems = illumination.getElementsByTagName('ambient');

	if(elems == null || elems.length != 1) {
		return "missing ambient element.";
	}

	var illumination_ambient = elems[0];

	var r = this.reader.getFloat(illumination_ambient, 'r');
	var g = this.reader.getFloat(illumination_ambient, 'g');
	var b = this.reader.getFloat(illumination_ambient, 'b');
	var a = this.reader.getFloat(illumination_ambient, 'a');

	this.illumination.ambient = [r,g,b,a];

	elems = illumination.getElementsByTagName('background');

	if(elems == null || elems.length != 1) {
		return "missing background element.";
	}

	var illumination_background = elems[0];

	r = this.reader.getFloat(illumination_background, 'r');
	g = this.reader.getFloat(illumination_background, 'g');
	b = this.reader.getFloat(illumination_background, 'b');
	a = this.reader.getFloat(illumination_background, 'a');

	this.illumination.background = [r,g,b,a];

	console.log("Illumination read from file: {doublesided=" + this.illumination.doublesided +
																							", local=" + this.illumination.local + "}");

	console.log("ambient = [ " + this.illumination.ambient + "] " +
							"background = ["+ this.illumination.background + "] ");

}

// --- Parse Lights ---
MySceneGraph.prototype.parseLights = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('lights');

	if (elems == null) { // erro não existe um lights - reporta e termina
		return "lights element is missing.";
	}

	if (elems.length != 1) { // erro tem mais do que um lights - reporta e termina
		return "lights zero or more than one 'lights' element found.";
	}

	var lights = elems[0];
	this.lights = new Object;
	this.lights.omni_list = [];
	this.lights.spot_list = [];

	var omnis = lights.getElementsByTagName('omni');
	var spots = lights.getElementsByTagName('spot');

	var num_elems = omnis.length + spots.length;

	if(num_elems == 0) {
		return "missing omnis or spots elements.";
	}

	if(num_elems != lights.children.length) {
		return "Found not omnis nor spot elements."
	}

	var n_omnis = omnis.length;
	var n_spots = spots.length;

	if(n_omnis != 0) { // tem omnis

		for (var i = 0; i < n_omnis; i++)
		{

			var omni = omnis[i];
			var omni_tmp = new Object;

			omni_tmp.id = omni.id;

			omni_tmp.enabled = this.reader.getBoolean(omni, 'enabled');

			elems = omni.getElementsByTagName('location');

			if(elems.length != 1) {
				return "missing location element in omni.";
			}

			var omnis_location = elems[0];

			var x = this.reader.getFloat(omnis_location, 'x');
			var y = this.reader.getFloat(omnis_location, 'y');
			var z = this.reader.getFloat(omnis_location, 'z');
			var w = this.reader.getFloat(omnis_location, 'w');

			omni_tmp.location = [x,y,z,w];

			elems = omni.getElementsByTagName('ambient');

			if(elems.length != 1) {
				return "missing ambient element in omni.";
			}

			var omnis_ambient = elems[0];

			var r = this.reader.getFloat(omnis_ambient, 'r');
			var g = this.reader.getFloat(omnis_ambient, 'g');
			var b = this.reader.getFloat(omnis_ambient, 'b');
			var a = this.reader.getFloat(omnis_ambient, 'a');

			omni_tmp.ambient = [r,g,b,a];

			elems = omni.getElementsByTagName('diffuse');

			if(elems.length != 1) {
				return "missing diffuse element in omni.";
			}

			var omnis_diffuse = elems[0];

			r = this.reader.getFloat(omnis_diffuse, 'r');
			g = this.reader.getFloat(omnis_diffuse, 'g');
			b = this.reader.getFloat(omnis_diffuse, 'b');
			a = this.reader.getFloat(omnis_diffuse, 'a');

			omni_tmp.diffuse = [r,g,b,a];

			elems = omni.getElementsByTagName('specular');

			if(elems.length != 1) {
				return "missing specular element in omni.";
			}

			var omnis_specular = elems[0];

			r = this.reader.getFloat(omnis_specular, 'r');
			g = this.reader.getFloat(omnis_specular, 'g');
			b = this.reader.getFloat(omnis_specular, 'b');
			a = this.reader.getFloat(omnis_specular, 'a');

			omni_tmp.specular = [r,g,b,a];

			this.lights.omni_list.push(omni_tmp);

		}

	}

	if (n_spots != 0){

		for (var i = 0; i < n_spots; i++)
		{

			var spot = spots[i];
			var spot_tmp = new Object;
			spots[i].enabled = this.reader.getBoolean(spot, 'enabled');
			spots[i].angle = this.reader.getFloat(spot, 'angle');
			spots[i].exponent = this.reader.getFloat(spot, 'exponent');

			spot_tmp.id = spot.id;

			elems = spot.getElementsByTagName('target');

			if(elems.length != 1) {
				return "missing target element in spot.";
			}

			var spots_target = elems[0];

			var x = this.reader.getFloat(spots_target, 'x');
			var y = this.reader.getFloat(spots_target, 'y');
			var z = this.reader.getFloat(spots_target, 'z');

			spot_tmp.target = [x,y,z];

			elems = spot.getElementsByTagName('location');

			if(elems.length != 1) {
				return "missing location element in spot.";
			}

			var spots_location = elems[0];

			x = this.reader.getFloat(spots_location, 'x');
			y = this.reader.getFloat(spots_location, 'y');
			z = this.reader.getFloat(spots_location, 'z');

			spot_tmp.location = [x,y,z,w];

			elems = spot.getElementsByTagName('ambient');

			if(elems.length != 1) {
				return "missing ambient element in spot.";
			}

			var spots_ambient = elems[0];

			var r = this.reader.getFloat(spots_ambient, 'r');
			var g = this.reader.getFloat(spots_ambient, 'g');
			var b = this.reader.getFloat(spots_ambient, 'b');
			var a = this.reader.getFloat(spots_ambient, 'a');

			spot_tmp.ambient = [r,g,b,a];

			elems = spot.getElementsByTagName('diffuse');

			if(elems.length != 1) {
				return "missing diffuse element in spot.";
			}

			var spots_diffuse = elems[0];

			r = this.reader.getFloat(spots_diffuse, 'r');
			g = this.reader.getFloat(spots_diffuse, 'g');
			b = this.reader.getFloat(spots_diffuse, 'b');
			a = this.reader.getFloat(spots_diffuse, 'a');

			spot_tmp.diffuse = [r,g,b,a];

			elems = spot.getElementsByTagName('specular');

			if(elems.length != 1) {
				return "missing specular element in spot.";
			}

			var spots_specular = elems[0];

			r = this.reader.getFloat(spots_specular, 'r');
			g = this.reader.getFloat(spots_specular, 'g');
			b = this.reader.getFloat(spots_specular, 'b');
			a = this.reader.getFloat(spots_specular, 'a');

			spot_tmp.specular = [r,g,b,a];

			this.lights.spot_list.push(spot_tmp);

		}

	}

	// Print results

	for(i = 0; i < this.lights.omni_list.length; i++) {
		console.log("Read omni item id " + this.lights.omni_list[i].id + " (enabled = "
																																		+ this.lights.omni_list[i].enabled + ")" +
								" location = [" + this.lights.omni_list[i].location + "]" +
								" ambient = [" + this.lights.omni_list[i].ambient + "]" +
								" diffuse = [" + this.lights.omni_list[i].diffuse + "]" +
								" specular = [" + this.lights.omni_list[i].specular + "]");
	}


	for(i = 0; i < this.lights.spot_list.length; i++) {
		console.log("Read spot item id " + this.lights.spot_list[i].id + " (enabled = " + this.lights.spot_list[i].enabled + ")" +
								" target = [" + this.lights.spot_list[i].target + "]" +
								" location = [" + this.lights.spot_list[i].location + "]" +
								" ambient = [" + this.lights.spot_list[i].ambient + "]" +
								" diffuse = [" + this.lights.spot_list[i].diffuse + "]" +
								" specular = [" + this.lights.spot_list[i].specular + "]");
	}

}

// --- Parse Textures ---
MySceneGraph.prototype.parseTextures = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('textures');

	// <texture id="ss" file="ss" length_s="ff" length_t="ff" />

	// iterate over every element
	var n_textures = elems.length;

	var textures = elems[0];
	var texture = textures.getElementsByTagName('texture');

	for (var i = 0; i < n_textures; i++)
	{

		var texture_i = texture[i];

		texture[i].file = this.reader.getString(texture_i, 'file');
		texture[i].length_s = this.reader.getFloat(texture_i, 'length_s');
		texture[i].length_t = this.reader.getFloat(texture_i, 'length_t');

		console.log("Read texture item id= " + texture[i].id +
								" file = " + texture[i].file +
								" length_s = " + texture[i].length_s +
								" length_t = " + texture[i].length_t);
	}
}

//--- Parse Materials ---
MySceneGraph.prototype.parseMaterials = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('materials');

	if (elems == null) { // erro não existe um materials - reporta e termina
		return "materials element is missing.";
	}

	var materials;
	var count = 0;

	for(i=0; i < elems.length; i++){
		if (elems[i].parentNode == rootElement){
			materials = elems[i];
			count++;
		}
	}

	if (count != 1) { // erro tem mais do que um materials - reporta e termina
		return "zero or more than one 'materials' element found.";
	}

	materials = elems[0];
	var materialsList = materials.getElementsByTagName('material');

	if (materialsList == null  || materialsList.length==0) {
		return "zero 'material' element found..";
	}

	this.materials = [];

	// iterate over every material
	for (var i = 0; i < materialsList.length; i++)
	{
		var material = materialsList[i];
		var m = new Object;

		//Id
		m.id = this.reader.getString(material, 'id', true);

		//Emission
		elems = material.getElementsByTagName('emission');

		if (elems == null  || elems.length != 1) {
			return "either zero or more than one 'emission' element found.";
		}
		var emission = elems[0];

		var r = this.reader.getFloat(emission, 'r', true);
		var g = this.reader.getFloat(emission, 'g', true);
		var b = this.reader.getFloat(emission, 'b', true);
		var a = this.reader.getFloat(emission, 'a', true);

		m.emission = [r,g,b,a];

		//Ambient
		elems = material.getElementsByTagName('ambient');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'ambient' element found.";
		}
		var ambient = elems[0];

		r = this.reader.getFloat(ambient, 'r', true);
		g = this.reader.getFloat(ambient, 'g', true);
		b = this.reader.getFloat(ambient, 'b', true);
		a = this.reader.getFloat(ambient, 'a', true);

		m.ambient = [r,g,b,a];

		//Diffuse
		elems = material.getElementsByTagName('diffuse');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'diffuse' element found.";
		}
		var diffuse = elems[0];

		r = this.reader.getFloat(diffuse, 'r', true);
		g = this.reader.getFloat(diffuse, 'g', true);
		b = this.reader.getFloat(diffuse, 'b', true);
		a = this.reader.getFloat(diffuse, 'a', true);

		m.diffuse = [r,g,b,a];

		//Specular
		elems = material.getElementsByTagName('specular');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'specular' element found.";
		}
		var specular = elems[0];

		r = this.reader.getFloat(specular, 'r', true);
		g = this.reader.getFloat(specular, 'g', true);
		b = this.reader.getFloat(specular, 'b', true);
		a = this.reader.getFloat(specular, 'a', true);

		m.specular = [r,g,b,a];

		//Shininess
		elems = material.getElementsByTagName('shininess');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'shininess' element found.";
		}
		var shininess = elems[0];

		m.shininess = this.reader.getFloat(shininess, 'value', true);

		this.materials.push(m);
	}

	console.log("Materials:");
	this.materials.forEach(function(material) {
		console.log("Material id = " + material.id +
				"\nEmission = [" + material.emission[0] + ", " + material.emission[1] + ", " + material.emission[2] + ", " + material.emission[3] + "]" +
				"\nAmbient = [" + material.ambient[0] + ", " + material.ambient[1] + ", " + material.ambient[2] + ", " + material.ambient[3] + "]" +
				"\nDiffuse = [" + material.diffuse[0] + ", " + material.diffuse[1] + ", " + material.diffuse[2] + ", " + material.diffuse[3] + "]" +
				"\nSpecular = [" + material.specular[0] + ", " + material.specular[1] + ", " + material.specular[2] + ", " + material.specular[3] + "]" +
				"\nShininess = " + material.shininess + "\n"
				);
	  });
}

//--- Parse Transformations ---
MySceneGraph.prototype.parseMTransformations = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('transformations');
	
	if (elems == null  || elems.length != 1) { //erro nenhum ou mais do que um transformations - reporta e termina
		return "zero or more than one 'transformations' element found.";
	}
	
	transformations = elems[0];
	
	var transformationsList =  transformations.getElementsByTagName('transformation');
	if (transformationsList == null  || transformationsList.length == 0) { //erro nenhuma transformation - reporta e termina
		return "no 'transformation' element found.";
	}
	
	this.transformations = [];
	
	for(i = 0; i < transformationsList.length; i++)
	{
		var transformation = transformationsList[i];
		var t = new Object;
		
		//Id
		t.id = this.reader.getString(transformation, 'id', true);
		
		//Transformations
		var list = transformation.children;
		
		if (list == null  || list.length == 0) { //erro nenhuma transformation - reporta e termina
			return "no 'translate', 'rotate' or 'scale' element found.";
		}
		
		t.list = [];
		
		for(j = 0; j < list.length; j++)
		{
			var s = new Object;
			
			switch(list[i].nodeName)
			{
		    case "TRANSLATE":
		        s.type = "translate";
		        s.x = this.reader.getFloat(list[i], 'x', true);
		        s.y = this.reader.getFloat(list[i], 'y', true);
		        s.z = this.reader.getFloat(list[i], 'z', true);
		        break;
		    case "ROTATE":
		    	s.type = "rotate";
		        s.axis = this.reader.getItem(list[i], 'axis', ['x','y','z']);
		        s.angle = this.reader.getFloat(list[i], 'angle', true);
		        break;
		    case "SCALE":
		    	s.type = "scale";
		        s.x = this.reader.getFloat(list[i], 'x', true);
		        s.y = this.reader.getFloat(list[i], 'y', true);
		        s.z = this.reader.getFloat(list[i], 'z', true);
		        break;
		    default:
		    	return "element found is not 'translate', 'rotate' or 'scale'.";
		    } 
			
			t.list.push(s);
		}
		
		this.transformations.push(t);
	}
}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) { // erro não existe um globals - reporta e termina
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
