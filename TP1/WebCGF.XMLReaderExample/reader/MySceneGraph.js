var degToRad = Math.PI / 180;
function MySceneGraph(filename, scene) { // filename: path
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	this.error = null;
	scene.graph = this;

	// File reading
	this.reader = new CGFXMLreader(); // ferramenta que le o ficheiro xml

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/' + filename, this); // abre o ficheiro xml

	// aqui estamos em condicoes de interpretar o ficheiro
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

	// --- Parse Materials ---
	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Transformations ---
	error = this.parseTransformations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Primitives ---
	error = this.parsePrimitives(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// --- Parse Components ---
	error = this.parseComponents(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.drawGraph();

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	// TODO: inserir no grafo os nós lidos no dsx
	this.scene.onGraphLoaded();
};

// --- Parse Scene ---
MySceneGraph.prototype.parseScene = function(rootElement) {

	if (rootElement.nodeName != "dsx")
			return "Cannot find a dsx element.";

	var elems =  rootElement.getElementsByTagName('scene');

	if (elems == null || elems.length != 1) // erro nennhuma ou mais do que um scene - reporta e termina
		return "Either zero or more than one 'scene' element found.";

	var scene = elems[0];

	if (scene != rootElement.children[0]) // erro na ordem dos elementos do ficheiro - reporta e termina
		return "Element 'scene' doesn't respect the order in the DSX file.";

	this.root = this.parseStringAttr(scene, "root");

	if(this.error != null)
		return this.error;

	this.axis_length = this.parseFloatAttr(scene, 'axis_length');

	if(this.error != null)
		return this.error;

	//Display values for Debugging
	console.log("");
	console.log("--- Parse Scene ---");
	console.log("Scene read from file: {root = " + this.root + ", axis_length = " + this.axis_length + "}");
	console.log("");

}

// --- Parse Views ---
MySceneGraph.prototype.parseViews = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('views');

	if (elems == null || elems.length != 1) // erro nenhuma ou mais do que um views - reporta e termina
		return "views zero or more than one 'views' element found.";

	var views = elems[0];

	if (views != rootElement.children[1]) // erro na ordem dos elementos do ficheiro - reporta e termina
		return "element 'views' doesn't respect the order in the DSX file.";

	this.views = new Object;

	this.views.default = this.parseStringAttr(views, 'default');
	if(this.error != null) return this.error;

	this.views.list = new Object;

	var num_perspectives = views.children.length;
	var perspectives = views.getElementsByTagName('perspective');

	if(num_perspectives != perspectives.length)
		return "Non 'perspective' elements found.";

	if(perspectives.length < 1)
		return "perspective element is missing.";

	// process each element and store its information
	for (var i = 0; i < perspectives.length; i++)
	{
		var p = perspectives[i];
		var perspective = new Object;

		var perspective_id = this.parseStringAttr(p, "id");
		if(this.error != null) return this.error;

		//check for duplicate ids
		if(perspective_id in this.views.list)
			return "Duplicate entry of perspective id (id=" + perspective_id +").";

		perspective.near = this.parseFloatAttr(p, "near");
		if(this.error != null) return this.error;

		perspective.far = this.parseFloatAttr(p, "far");
		if(this.error != null) return this.error;

		var a = this.parseFloatAttr(p, "angle");
		perspective.angle = degToRad*a;
		if(this.error != null) return this.error;

		var perspectives_from = p.getElementsByTagName('from');
		var perspectives_to = p.getElementsByTagName('to');

		if(perspectives_from.length != 1 && perspectives_to.length != 1)
			return " missing \"from\" and/or \"to\" elements.";

		var perspective_from = perspectives_from[0];

		var x = this.parseFloatAttr(perspective_from, 'x');
		if(this.error != null) return this.error;

		var y = this.parseFloatAttr(perspective_from, 'y');
		if(this.error != null) return this.error;

		var z = this.parseFloatAttr(perspective_from, 'z');
		if(this.error != null) return this.error;

		perspective.from = [x,y,z];

		var perspective_to = perspectives_to[0];

		x = this.parseFloatAttr(perspective_to, 'x');
		if(this.error != null) return this.error;

		y = this.parseFloatAttr(perspective_to, 'y');
		if(this.error != null) return this.error;

		z = this.parseFloatAttr(perspective_to, 'z');
		if(this.error != null) return this.error;

		perspective.to = [x,y,z];

		this.views.list[perspective_id] = perspective;
	}

	//check default view
	if(!(this.views.default in this.views.list))
		return "Cannot find default view (id=" + this.views.default + ").";

	//Display values for Debugging
	console.log("--- Parse Views ---");
	console.log("{default = " + this.views.default + "}");
	for(i in this.views.list) {
		console.log("Item id = " + i +
				" { near = " + this.views.list[i].near +
				", far = " + this.views.list[i].far +
				", angle = " + this.views.list[i].angle +
				", from = [ " + this.views.list[i].from + "]" +
				", to = ["+ this.views.list[i].to + "] }");
	}
	console.log("");
}

// --- Parse Illumination ---
MySceneGraph.prototype.parseIllumination = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('illumination');

	if (elems == null || elems.length != 1) // erro nenhum ou mais do que um illumination - reporta e termina
		return "either zero or more than one 'illumination' element found.";

	var illumination = elems[0];

	if (illumination != rootElement.children[2]) // erro na ordem dos elementos do ficheiro - reporta e termina
		return "element 'illumination' doesn't respect the order in the DSX file.";

	this.illumination = new Object;

	this.illumination.doublesided = this.parseIntegerAttrAsBoolean(illumination, 'doublesided');
	if(this.error != null) return this.error;

	this.illumination.local = this.parseIntegerAttrAsBoolean(illumination, 'local');
	if(this.error != null) return this.error;

	elems = illumination.getElementsByTagName('ambient');

	if(elems == null || elems.length != 1)
		return "missing ambient element.";

	var illumination_ambient = elems[0];

	var r = this.parseFloatAttr(illumination_ambient, 'r');
	if(this.error != null) return this.error;

	var g = this.parseFloatAttr(illumination_ambient, 'g');
	if(this.error != null) return this.error;

	var b = this.parseFloatAttr(illumination_ambient, 'b');
	if(this.error != null) return this.error;

	var a = this.parseFloatAttr(illumination_ambient, 'a');
	if(this.error != null) return this.error;

	// this.illumination.ambient = [r,g,b,a];
	this.scene.graph.ambient = [r,g,b,a];

	elems = illumination.getElementsByTagName('background');

	if(elems == null || elems.length != 1)
		return "missing background element.";

	var illumination_background = elems[0];

	r = this.parseFloatAttr(illumination_background, 'r');
	if(this.error != null) return this.error;

	g = this.parseFloatAttr(illumination_background, 'g');
	if(this.error != null) return this.error;

	b = this.parseFloatAttr(illumination_background, 'b');
	if(this.error != null) return this.error;

	a = this.parseFloatAttr(illumination_background, 'a');
	if(this.error != null) return this.error;

	// this.illumination.background = [r,g,b,a];
	this.scene.graph.background = [r,g,b,a];

	//Display values for Debugging
	console.log("--- Parse Illumination ---")
	console.log("doublesided = " + this.illumination.doublesided);
	console.log("local = " + this.illumination.local);
	console.log("ambient = [" + this.scene.graph.ambient + "]")
	console.log("background = ["+ this.scene.graph.background + "]");
	console.log("");
}

// --- Parse Lights ---
MySceneGraph.prototype.parseLights = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('lights');

	if (elems == null || elems.length != 1) // erro nenhum ou mais do que um lights - reporta e termina
		return "either zero or more than one 'lights' element found.";

	var lights = elems[0];

	if (lights != rootElement.children[3]) // erro na ordem dos elementos do ficheiro - reporta e termina
		return "element 'lights' doesn't respect the order in the DSX file.";

	this.lights = new Object;
	this.lights.omnis = new Object;
	this.lights.spots = new Object;

	var omnis = lights.getElementsByTagName('omni');
	var spots = lights.getElementsByTagName('spot');

	var num_elems = omnis.length + spots.length;

	if(num_elems == 0)
		return "missing omnis or spots elements.";

	if(num_elems != lights.children.length)
		return "Found elements that are neither omni nor spot."

	// OMNIS
	for (var i = 0; i < omnis.length; i++)
	{
		var o = omnis[i];
		var omni = new Object;

		var omni_id = this.parseStringAttr(o, "id");
		if(this.error != null) return this.error;

		//check for duplicate ids
		if(omni_id in this.lights.omnis)
			return "Duplicate entry of omni id (id=" + omni_id +").";

		omni.enabled = this.parseIntegerAttrAsBoolean(o, 'enabled');
		if(this.error != null) return this.error;

		elems = o.getElementsByTagName('location');

		if(elems.length != 1)
			return "missing location element in omni.";

		var o_location = elems[0];

		var x = this.parseFloatAttr(o_location, 'x');
		if(this.error != null) return this.error;

		var y = this.parseFloatAttr(o_location, 'y');
		if(this.error != null) return this.error;

		var z = this.parseFloatAttr(o_location, 'z');
		if(this.error != null) return this.error;

		var w = this.parseFloatAttr(o_location, 'w');
		if(this.error != null) return this.error;

		omni.location = [x,y,z,w];

		elems = o.getElementsByTagName('ambient');

		if(elems.length != 1)
			return "missing ambient element in omni.";

		var ambient = elems[0];

		var r = this.parseFloatAttr(ambient, 'r');
		if(this.error != null) return this.error;

		var g = this.parseFloatAttr(ambient, 'g');
		if(this.error != null) return this.error;

		var b = this.parseFloatAttr(ambient, 'b');
		if(this.error != null) return this.error;

		var a = this.parseFloatAttr(ambient, 'a');
		if(this.error != null) return this.error;

		omni.ambient = [r,g,b,a];

		elems = o.getElementsByTagName('diffuse');

		if(elems.length != 1)
			return "missing diffuse element in omni.";

		var diffuse = elems[0];

		r = this.parseFloatAttr(diffuse, 'r');
		if(this.error != null) return this.error;

		g = this.parseFloatAttr(diffuse, 'g');
		if(this.error != null) return this.error;

		b = this.parseFloatAttr(diffuse, 'b');
		if(this.error != null) return this.error;

		a = this.parseFloatAttr(diffuse, 'a');
		if(this.error != null) return this.error;

		omni.diffuse = [r,g,b,a];

		elems = o.getElementsByTagName('specular');

		if(elems.length != 1)
			return "missing specular element in omni.";

		var specular = elems[0];

		r = this.parseFloatAttr(specular, 'r');
		if(this.error != null) return this.error;

		g = this.parseFloatAttr(specular, 'g');
		if(this.error != null) return this.error;

		b = this.parseFloatAttr(specular, 'b');
		if(this.error != null) return this.error;

		a = this.parseFloatAttr(specular, 'a');
		if(this.error != null) return this.error;

		omni.specular = [r,g,b,a];

		this.lights.omnis[omni_id] = omni;
	}

	//SPOTS
	for (var i = 0; i < spots.length; i++)
	{
		var s = spots[i];
		var spot = new Object;

		var spot_id = this.parseStringAttr(s, "id");
		if(this.error != null) return this.error;

		//check for duplicate ids
		if(spot_id in this.lights.spots)
			return "Duplicate entry of spot id (id=" + spots_id +").";

		spot.enabled = this.parseIntegerAttrAsBoolean(s, 'enabled');
		if(this.error != null) return this.error;

		var a = this.parseFloatAttr(s, 'angle');
		spot.angle = degToRad*a;
		if(this.error != null) return this.error;

		spot.exponent = this.parseFloatAttr(s, 'exponent');
		if(this.error != null) return this.error;

		//target
		elems = s.getElementsByTagName('target');

		if(elems.length != 1)
			return "missing target element in spot.";

		var target = elems[0];

		var x = this.parseFloatAttr(target, 'x');
		if(this.error != null) return this.error;

		var y = this.parseFloatAttr(target, 'y');
		if(this.error != null) return this.error;

		var z = this.parseFloatAttr(target, 'z');
		if(this.error != null) return this.error;

		spot.target = [x,y,z];

		//location
		elems = s.getElementsByTagName('location');

		if(elems.length != 1)
			return "missing location element in spot.";

		var location = elems[0];

		x = this.parseFloatAttr(location, 'x');
		if(this.error != null) return this.error;

		y = this.parseFloatAttr(location, 'y');
		if(this.error != null) return this.error;

		z = this.parseFloatAttr(location, 'z');
		if(this.error != null) return this.error;

		spot.location = [x,y,z,w];

		//ambient
		elems = s.getElementsByTagName('ambient');

		if(elems.length != 1)
			return "missing ambient element in spot.";

		var ambient = elems[0];

		var r = this.parseFloatAttr(ambient, 'r');
		if(this.error != null) return this.error;

		var g = this.parseFloatAttr(ambient, 'g');
		if(this.error != null) return this.error;

		var b = this.parseFloatAttr(ambient, 'b');
		if(this.error != null) return this.error;

		var a = this.parseFloatAttr(ambient, 'a');
		if(this.error != null) return this.error;

		spot.ambient = [r,g,b,a];

		//diffuse
		elems = s.getElementsByTagName('diffuse');

		if(elems.length != 1)
			return "missing diffuse element in spot.";

		var diffuse = elems[0];

		r = this.parseFloatAttr(diffuse, 'r');
		if(this.error != null) return this.error;

		g = this.parseFloatAttr(diffuse, 'g');
		if(this.error != null) return this.error;

		b = this.parseFloatAttr(diffuse, 'b');
		if(this.error != null) return this.error;

		a = this.parseFloatAttr(diffuse, 'a');
		if(this.error != null) return this.error;

		spot.diffuse = [r,g,b,a];

		//specular
		elems = s.getElementsByTagName('specular');

		if(elems.length != 1)
			return "missing specular element in spot.";

		var specular = elems[0];

		r = this.parseFloatAttr(specular, 'r');
		if(this.error != null) return this.error;

		g = this.parseFloatAttr(specular, 'g');
		if(this.error != null) return this.error;

		b = this.parseFloatAttr(specular, 'b');
		if(this.error != null) return this.error;

		a = this.parseFloatAttr(specular, 'a');
		if(this.error != null) return this.error;

		spot.specular = [r,g,b,a];

		this.lights.spots[spot_id] = spot;
	}

	//Display values for Debugging
	console.log("--- Parse Lights ---")
	for(i in this.lights.omnis) {
		console.log("Omni id = " + i +
				" { enabled = " + this.lights.omnis[i].enabled +
				", location = [" + this.lights.omnis[i].location + "]" +
				", ambient = [" + this.lights.omnis[i].ambient + "]" +
				", diffuse = [" + this.lights.omnis[i].diffuse + "]" +
				", specular = [" + this.lights.omnis[i].specular + "] }");
	}

	for(i in this.lights.spots) {
		console.log("Spot id = " + i +
				" { enabled = " + this.lights.spots[i].enabled +
				", target = [" + this.lights.spots[i].target + "]" +
				", location = [" + this.lights.spots[i].location + "]" +
				", ambient = [" + this.lights.spots[i].ambient + "]" +
				", diffuse = [" + this.lights.spots[i].diffuse + "]" +
				", specular = [" + this.lights.spots[i].specular + "] }");
	}
	console.log("");
}

// --- Parse Textures ---
MySceneGraph.prototype.parseTextures = function(rootElement) {

	var elems = rootElement.getElementsByTagName('textures');

	if (elems == null || elems.length != 1) { // erro nenhum ou mais do que um textures - reporta e termina
		return "either zero or more than one 'textures' element found.";
	}

	var textures = elems[0];

	if (textures != rootElement.children[4]) // erro na ordem dos elementos do ficheiro - reporta e termina
		return "element 'textures' doesn't respect the order in the DSX file.";

	var texture_list = textures.getElementsByTagName('texture');

	if(texture_list == null || texture_list.length < 1) {
		return "There must be at least one 'texture' element in 'textures'.";
	}

	this.textures = new Object;

	for (var i = 0; i < texture_list.length; i++)
	{
		var t = texture_list[i];
		var texture = new Object;

		var texture_id = this.parseStringAttr(t, 'id');
		if(this.error != null) return this.error;

		//check for duplicate ids
		if(texture_id in this.textures)
			return "Duplicate entry of texture id (id=" + texture_id +").";

		texture.file = this.parseStringAttr(t, 'file');
		if(this.error != null) return this.error;

		texture.length_s = this.parseFloatAttr(t, 'length_s');
		if(this.error != null) return this.error;

		texture.length_t = this.parseFloatAttr(t, 'length_t');
		if(this.error != null) return this.error;

		this.textures[texture_id] = texture;
	}

	//Display values for Debugging
	console.log("--- Parse Textures ---");
	for(i in this.textures) {
		var x = this.textures[i];
		console.log("Texture id = " + i +
				" { file = " + x.file +
				", length_s = " + x.length_s +
				", length_t = " + x.length_t + " }");
	}
	console.log("");
}

//--- Parse Materials ---
MySceneGraph.prototype.parseMaterials = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('materials');

	if (elems == null) { // erro não existe nenhum materials - reporta e termina
		return "materials element is missing.";
	}

	//checks number of 'materials' elements in root (ignores 'materials' in components)
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

	var materialsList = materials.getElementsByTagName('material');

	if (materialsList == null  || materialsList.length==0) {
		return "zero 'material' element found..";
	}

	this.materials = new Object;

	// iterate over every material
	for (var i = 0; i < materialsList.length; i++)
	{
		var material = materialsList[i];
		var m = new Object;

		//Id
		var id = this.parseStringAttr(material, 'id');
		if(this.error != null) return this.error;

		//check for duplicate ids
		if (id in this.materials) {
			return "Duplicate entry of material id (id=" + id +").";
		}

		//Emission
		elems = material.getElementsByTagName('emission');

		if (elems == null  || elems.length != 1) {
			return "either zero or more than one 'emission' element found.";
		}
		var emission = elems[0];

		var r = this.parseFloatAttr(emission, 'r');
		if(this.error != null) return this.error;
		var g = this.parseFloatAttr(emission, 'g');
		if(this.error != null) return this.error;
		var b = this.parseFloatAttr(emission, 'b');
		if(this.error != null) return this.error;
		var a = this.parseFloatAttr(emission, 'a');
		if(this.error != null) return this.error;

		m.emission = [r,g,b,a];

		//Ambient
		elems = material.getElementsByTagName('ambient');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'ambient' element found.";
		}
		var ambient = elems[0];

		var r = this.parseFloatAttr(ambient, 'r');
		if(this.error != null) return this.error;
		var g = this.parseFloatAttr(ambient, 'g');
		if(this.error != null) return this.error;
		var b = this.parseFloatAttr(ambient, 'b');
		if(this.error != null) return this.error;
		var a = this.parseFloatAttr(ambient, 'a');
		if(this.error != null) return this.error;

		m.ambient = [r,g,b,a];

		//Diffuse
		elems = material.getElementsByTagName('diffuse');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'diffuse' element found.";
		}
		var diffuse = elems[0];

		var r = this.parseFloatAttr(diffuse, 'r');
		if(this.error != null) return this.error;
		var g = this.parseFloatAttr(diffuse, 'g');
		if(this.error != null) return this.error;
		var b = this.parseFloatAttr(diffuse, 'b');
		if(this.error != null) return this.error;
		var a = this.parseFloatAttr(diffuse, 'a');
		if(this.error != null) return this.error;

		m.diffuse = [r,g,b,a];

		//Specular
		elems = material.getElementsByTagName('specular');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'specular' element found.";
		}
		var specular = elems[0];

		var r = this.parseFloatAttr(specular, 'r');
		if(this.error != null) return this.error;
		var g = this.parseFloatAttr(specular, 'g');
		if(this.error != null) return this.error;
		var b = this.parseFloatAttr(specular, 'b');
		if(this.error != null) return this.error;
		var a = this.parseFloatAttr(specular, 'a');
		if(this.error != null) return this.error;

		m.specular = [r,g,b,a];

		//Shininess
		elems = material.getElementsByTagName('shininess');

		if (elems == null  || elems.length != 1) {
			return "zero or more than one 'shininess' element found.";
		}
		var shininess = elems[0];

		m.shininess = this.parseFloatAttr(shininess, 'value');

		this.materials[id] = m;
	}

	//Display values for Debugging
	console.log("--- Parse Materials ---");
	for(id in this.materials) {
		console.log("Material id = " + id +
				" { emission = [" + this.materials[id].emission + "]" +
				", ambient = [" + this.materials[id].ambient + "]" +
				", diffuse = [" + this.materials[id].diffuse + "]" +
				", specular = [" + this.materials[id].specular + "]" +
				", shininess = " + this.materials[id].shininess + "}"
				);
	}

	console.log("");
}

//--- Parse Transformations ---
MySceneGraph.prototype.parseTransformations = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('transformations');

	if (elems == null  || elems.length != 1) { //erro nenhum ou mais do que um 'transformations - reporta e termina
		return "zero or more than one 'transformations' element found.";
	}

	transformations = elems[0];

	var transformationsList = transformations.getElementsByTagName('transformation');
	if (transformationsList == null  || transformationsList.length == 0) { //erro nenhum 'transformation' - reporta e termina
		return "no 'transformation' element found.";
	}

	this.transformations = [];

	for(i = 0; i < transformationsList.length; i++)
	{
		var t = transformationsList[i];
		var transformation = new Object;

		//Id
		transformation.id = this.parseStringAttr(t, 'id');
		if(this.error != null) return this.error;

		//check for duplicate ids
		this.transformations.forEach(function(x){
			if (x.id == transformation.id) {
				this.error = "Duplicate entry of transformation id (id=" + x.id +").";
				return;
			}
		}, this);

		//Transformations
		var singleTransformationList = t.children;

		if (singleTransformationList == null  || singleTransformationList.length == 0) { //erro nenhuma transformation - reporta e termina
			return "no 'translate', 'rotate' or 'scale' element found.";
		}

		transformation.list = [];

		for(j = 0; j < singleTransformationList.length; j++)
		{
			s = singleTransformationList[j];
			var singletransformation = new Object;

			switch(s.nodeName)
			{
		    case "translate":
		    	singletransformation.type = "translate";
		    	singletransformation.x = this.parseFloatAttr(s, 'x');
				if(this.error != null) return this.error;
		    	singletransformation.y = this.parseFloatAttr(s, 'y');
				if(this.error != null) return this.error;
		    	singletransformation.z = this.parseFloatAttr(s, 'z');
				if(this.error != null) return this.error;
		        break;
		    case "rotate":
		    	singletransformation.type = "rotate";
		    	singletransformation.axis = this.parseItemAttr(s, 'axis', ['x','y','z']);
				if(this.error != null) return this.error;
					var a = this.parseFloatAttr(s, 'angle');
					singletransformation.angle = degToRad*a;
				if(this.error != null) return this.error;
		        break;
		    case "scale":
		    	singletransformation.type = "scale";
		    	singletransformation.x = this.parseFloatAttr(s, 'x');
				if(this.error != null) return this.error;
		    	singletransformation.y = this.parseFloatAttr(s, 'y');
				if(this.error != null) return this.error;
		    	singletransformation.z = this.parseFloatAttr(s, 'z');
				if(this.error != null) return this.error;
		        break;
		    default:
		    	return "element found is not 'translate', 'rotate' or 'scale'.";
		    }

			transformation.list.push(singletransformation);
		}

		this.transformations.push(transformation);
	}

	//Display values for Debugging
	console.log("--- Parse Transformations ---");
	this.transformations.forEach(function(t) {
		console.log("Transformation id = " + t.id + " (" + t.list.length + " subtransformations):");
		t.list.forEach(function(s){
			if(s.type == "rotate")
				console.log("	" + s.type + ": axis=" + s.axis + ", angle=" + s.angle);
			else
				console.log("	" + s.type + ": [" + s.x + "," + s.y + "," + s.z + "]");
		});
	});
	console.log("");
}

//--- Parse Primitives ---
MySceneGraph.prototype.parsePrimitives = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('primitives');

	if (elems == null  || elems.length != 1) { //erro nenhum ou mais do que um primitives - reporta e termina
		return "zero or more than one 'primitives' element found.";
	}

	primitives = elems[0];

	var primitivesList = primitives.getElementsByTagName('primitive');
	if (primitivesList == null  || primitivesList.length == 0) { //erro nenhuma primitive - reporta e termina
		return "no 'primitive' element found.";
	}

	this.primitives = [];

	for(i = 0; i < primitivesList.length; i++)
	{
		var p = primitivesList[i];
		var primitive = new Object;

		//Id
		primitive.id = this.parseStringAttr(p, 'id');
		if(this.error != null) return this.error;

		//check for duplicate ids
		this.primitives.forEach(function(x){
			if (x.id == primitive.id) {
				this.error = "Duplicate entry of primitive id (id=" + x.id +").";
				return;
			}
		}, this);

		//Geometric Figure
		if (p.children == null  || p.children.length != 1) { //erro primitive vazia - reporta e termina
			return "'primitive' element with id="+ primitive.id +" is empty.";
		}

		var figure = p.children[0];

		switch(figure.nodeName)
		{
	    case "rectangle":
	    	primitive.type = "rectangle";
	    	primitive.x1 = this.parseFloatAttr(figure, 'x1');
			if(this.error != null) return this.error;
	    	primitive.y1 = this.parseFloatAttr(figure, 'y1');
			if(this.error != null) return this.error;
	    	primitive.x2 = this.parseFloatAttr(figure, 'x2');
			if(this.error != null) return this.error;
	    	primitive.y2 = this.parseFloatAttr(figure, 'y2');
			if(this.error != null) return this.error;
	        break;
	    case "triangle":
	    	primitive.type = "triangle";
	    	primitive.x1 = this.parseFloatAttr(figure, 'x1');
			if(this.error != null) return this.error;
	    	primitive.y1 = this.parseFloatAttr(figure, 'y1');
			if(this.error != null) return this.error;
	    	primitive.z1 = this.parseFloatAttr(figure, 'z1');
			if(this.error != null) return this.error;
	    	primitive.x2 = this.parseFloatAttr(figure, 'x2');
			if(this.error != null) return this.error;
	    	primitive.y2 = this.parseFloatAttr(figure, 'y2');
			if(this.error != null) return this.error;
	    	primitive.z2 = this.parseFloatAttr(figure, 'z2');
			if(this.error != null) return this.error;
	    	primitive.x3 = this.parseFloatAttr(figure, 'x3');
			if(this.error != null) return this.error;
	    	primitive.y3 = this.parseFloatAttr(figure, 'y3');
			if(this.error != null) return this.error;
	    	primitive.z3 = this.parseFloatAttr(figure, 'z3');
			if(this.error != null) return this.error;
	        break;
	    case "cylinder":
	    	primitive.type = "cylinder";
	    	primitive.base = this.parseFloatAttr(figure, 'base');
			if(this.error != null) return this.error;
	    	primitive.top = this.parseFloatAttr(figure, 'top');
			if(this.error != null) return this.error;
	    	primitive.height = this.parseFloatAttr(figure, 'height');
			if(this.error != null) return this.error;
	    	primitive.slices = this.parseIntegerAttr(figure, 'slices');
			if(this.error != null) return this.error;
	    	primitive.stacks = this.parseIntegerAttr(figure, 'stacks');
			if(this.error != null) return this.error;
	        break;
	    case "sphere":
	    	primitive.type = "sphere";
	    	primitive.radius = this.parseFloatAttr(figure, 'radius');
			if(this.error != null) return this.error;
	    	primitive.slices = this.parseIntegerAttr(figure, 'slices');
			if(this.error != null) return this.error;
	    	primitive.stacks = this.parseIntegerAttr(figure, 'stacks');
			if(this.error != null) return this.error;
	        break;
	    case "torus":
	    	primitive.type = "torus";
	    	primitive.inner = this.parseFloatAttr(figure, 'inner');
			if(this.error != null) return this.error;
	    	primitive.outer = this.parseFloatAttr(figure, 'outer');
			if(this.error != null) return this.error;
	    	primitive.slices = this.parseIntegerAttr(figure, 'slices');
			if(this.error != null) return this.error;
	    	primitive.loops = this.parseIntegerAttr(figure, 'loops');
			if(this.error != null) return this.error;
	        break;
	    default:
	    	return "element found is not 'rectangle', 'triangle', 'cylinder', 'sphere' or torus.";
	    }

		this.primitives.push(primitive);
	}

	//Display values for Debugging
	console.log("--- Parse Primitives ---");
	this.primitives.forEach(function(p) {
		switch(p.type)
		{
	    case "rectangle":
	    	console.log("Primitive id = " + p.id + " { type = " + p.type + ", x1 = "+ p.x1 + ", y1 = " + p.y1 + ", x2 = " + p.x2 + ", y2 = " + p.y2 + " }");
	        break;
	    case "triangle":
	    	console.log("Primitive id = " + p.id + " { type = " + p.type + ", x1 = "+ p.x1 + ", y1 = " + p.y1 + ", z1 = " + p.z1 + ", x2 = " + p.x2 + ", y2 = " + p.y2 + ", z2 = " + p.z2 + ", x3 = " + p.x3 + ", y3 = " + p.y3 + ", z3 = " + p.z3 + " }");
	        break;
	    case "cylinder":
	    	console.log("Primitive id = " + p.id + " { type = " + p.type + ", base="+ p.base + ", top = " + p.top + ", height = " + p.height + ", slices = " + p.slices + ", stacks = " + p.stacks + " }");
	        break;
	    case "sphere":
	    	console.log("Primitive id = " + p.id + " { type = " + p.type + ", radius = "+ p.radius + ", slices = " + p.slices + ", stacks = " + p.stacks + " }");
	        break;
	    case "torus":
	    	console.log("Primitive id = " + p.id + " { type = " + p.type + ", inner = "+ p.inner + ", outer = " + p.outer + ", slices = " + p.slices + ", loops = " + p.loops + " }");
	        break;
	    }
	});
}

//--- Parse Components ---
MySceneGraph.prototype.parseComponents = function(rootElement) {

	var elems =  rootElement.getElementsByTagName('components');

	if (elems == null  || elems.length != 1) //erro nenhum ou mais do que um components - reporta e termina
		return "zero or more than one 'components' element found.";

	var components = elems[0];

	var componentsList = components.getElementsByTagName('component');
	if (componentsList == null  || componentsList.length == 0) //erro nenhuma component - reporta e termina
		return "no 'component' element found.";

	if (componentsList.length != components.children.length) //erro elemento 'component' nao encontrado - reporta e termina
		return "non 'component' element found.";

	this.components = new Object;

	for(i = 0; i < componentsList.length; i++)
	{
		var c = componentsList[i];
		var component = new Object;
		var m = mat4.create();
		mat4.identity(m);

		//id
		var id = this.parseStringAttr(c, "id");
		if(this.error != null) return this.error;

		if(id in this.components)
			return "Duplicate entry of component id (id=" + id +").";

		var node = new Node(id);

		//transformation
		elems = c.getElementsByTagName('transformation');

		if (elems == null  || elems.length != 1) //erro nenhum ou mais do que um transformation - reporta e termina
			return "zero or more than one 'transformation' element found in component " + id;

		var transformation = elems[0];
		elems = transformation.getElementsByTagName('transformationref');

		if (elems != null  && elems.length == 1)
		{
			if (transformation.children.length != 1) //erro transformationref tem que ser exclusiva - reporta e termina
				return "'transformationref' must be exclusive in component " + id;

			var transformationref = this.parseStringAttr(elems[0], "id");
			if(this.error != null) return this.error;

			// check if tansformation with this id exists
			if(!(transformationref in this.transformations))
				return "Cannot find a transformation with id=" + transformationref;


			for(k = 0; k < this.transformations[transformationref].list.length; k++) {

					switch (this.transformations[transformationref].list[k].type) {
						case "translate":
							this.translateMatrix(m, this.transformations[transformationref].list[k].x, this.transformations[transformationref].list[k].y, this.transformations[transformationref].list[k].z);
							break;

						case "rotate":
							this.rotateMatrix(m, this.transformations[transformationref].list[k].axis, this.transformations[transformationref].list[k].angle);
							break;

						case "scale":
							this.scaleMatrix(m, this.transformations[transformationref].list[k].x, this.transformations[transformationref].list[k].y, this.transformations[transformationref].list[k].z);
							break;

						default:
							return "Not a valid transformation.";
					}
			}
		}
		else
		{
			for(j = 0; j < transformation.children.length; j++)
			{
				var t = transformation.children[j];
				var subtransformation = new Object;

				switch(t.nodeName)
				{
			    case "translate":
			    	subtransformation.type = "translate";

						subtransformation.x = this.parseFloatAttr(t, 'x');
						if(this.error != null) return this.error;

			    	subtransformation.y = this.parseFloatAttr(t, 'y');
						if(this.error != null) return this.error;

						subtransformation.z = this.parseFloatAttr(t, 'z');
						if(this.error != null) return this.error;

						this.translateMatrix(m, subtransformation.x, subtransformation.y, subtransformation.z);

						break;
			    case "rotate":
			    	subtransformation.type = "rotate";

						subtransformation.axis = this.parseItemAttr(t, 'axis', ['x','y','z']);
						if(this.error != null) return this.error;

						var a = this.parseFloatAttr(t, 'angle');
						subtransformation.angle = degToRad*a;
						if(this.error != null) return this.error;

						this.rotateMatrix(m, subtransformation.axis, subtransformation.angle);

			    	break;
			    case "scale":
			    	subtransformation.type = "scale";

						subtransformation.x = this.parseFloatAttr(t, 'x');
						if(this.error != null) return this.error;

			    	subtransformation.y = this.parseFloatAttr(t, 'y');
						if(this.error != null) return this.error;

						subtransformation.z = this.parseFloatAttr(t, 'z');
						if(this.error != null) return this.error;

						this.scaleMatrix(m, subtransformation.x, subtransformation.y, subtransformation.z);

			        break;
			    default:
			    	return "element found is not 'translate', 'rotate' or 'scale'.";
			    }
			}
		}

		node.setTransformations(m);

		//materials
		elems = c.getElementsByTagName('materials');

		if (elems == null  || elems.length != 1) //erro nenhum ou mais do que um materials - reporta e termina
			return "zero or more than one 'materials' element found in component " + id;

		var materials = elems[0];

		var materialsList = materials.getElementsByTagName('material');

		if (materialsList == null  || materialsList.length == 0)//erro nenhum material - reporta e termina
			return "zero 'material' elements found in component " + id;

		if (materialsList.length != materials.children.length) //erro elemento nao 'material' encontrado - reporta e termina
			return "non 'material' element found.";

		for(j = 0; j < materialsList.length; j++)
		{
			var material = materialsList[j];

			var materialid = this.parseStringAttr(material, "id");
			if(this.error != null) return this.error;

	    if(materialid == "inherit")
				node.addMaterial("inherit");

			else if(!(materialid in this.materials)) // check if material with this id exists
				return "Cannot find a material with id=" + materialid;

			else
				node.addMaterial(this.materials[materialid]);
		}

		//texture
		elems = c.getElementsByTagName('texture');

		if (elems == null  || elems.length != 1) //erro nenhum ou mais do que um texture - reporta e termina
			return "zero or more than one 'texture' element found in component " + id;

		var texture = elems[0];

		var textureid = this.parseStringAttr(texture, "id");
		if(this.error != null) return this.error;

		if(textureid == "inherit")
			node.setTexture("inherit");

		else if(textureid == "none")
			node.setTexture("none");

		else if(!(textureid in this.textures))
			return "Cannot find a texture with id=" + textureid;

		else
			node.setTexture(this.textures[textureid]);

		//children
		elems = c.getElementsByTagName('children');

		if (elems == null  || elems.length != 1) //erro nenhum ou mais do que um children - reporta e termina
			return "zero or more than one 'children' element found in component " + id;

		var children = elems[0].children;

		for(j = 0; j < children.length; j++)
		{
			var c = children[j];
			var child = new Object;

			switch(c.nodeName)
			{
		    case "componentref":
		    	child.type = "component";

		    	child.id = this.parseStringAttr(c, "id");
					if(this.error != null) return this.error;

					  break;
		    case "primitiveref":
		    	child.type = "primitive";

		    	child.id = this.parseStringAttr(c, "id");
					if(this.error != null) return this.error;

					if(!(child.id in this.primitives))
						return "Cannot find a primitive with id=" + child.id;

					break;
		    default:
		    	return "element found in " + id + " is not 'componentref' or 'primitiveref' (" + c.nodeName +")."  ;
	    }

			node.addChildren(child);

		}

		this.components[id] = node;
	}

	for(id in this.components) {

		for(k = 0; k < this.components[id].children.length; k++) {

			if(this.components[id].children[k].type == "primitive") {

				if(!(this.components[id].children[k].id in this.primitives))
					return "Cannot find a primitive with id=" + this.components[id].children[k].id;

			} else {

				if(!(this.components[id].children[k].id in this.components))
					return "Cannot find a component with id=" + this.components[id].children[k].id;

			}

		}

	}

	/*console.log("Components ("+ this.components.length + "):\n\n");
	this.components.forEach(function(c) {
		//id
		console.log("Component " + c.id);
		//transformations
		if (c.transformationref != null)
			console.log("transformationref id=" + c.transformationref);
		else{
			console.log("transformations: ");
			c.transformations.forEach(function(t) {
				if (t.type == "rotate")
					console.log(t.type + ": axis=" + t.axis + " angle=" + t.angle );
				else
					console.log(t.type + ": x=" + t.x + ": y=" + t.y + " z=" + t.z );
			});
		}
		//materials
		console.log("materials:");
		c.materials.forEach(function(m_id) {
			console.log("material id=" + m_id );
		});
		//texture
		console.log("texture id=" + c.textureid );
		//children
		console.log("children: ");
		c.children.forEach(function(ch) {
			console.log(ch.type + ": id=" + ch.id );
		});
	});*/

}

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};

MySceneGraph.prototype.parseStringAttr = function(elem, attr) {

	var e = this.reader.getString(elem, attr, false);

	//errors
	if(e == null)
		this.error = "Attribute '" + attr + "' not found.";

	if(e == "")
		this.error = "Attribute '" + attr + "' value cannot be an empty string.";

	return e;
}

MySceneGraph.prototype.parseFloatAttr = function(elem, attr) {

	var e = this.reader.getFloat(elem, attr, false);

	//errors
	if(e == null)
		this.error = "Attribute '" + attr + "' not found.";

	if( isNaN(e) )
		this.error = "Attribute '" + attr + "' value must be a float number.";

	return e;
}

MySceneGraph.prototype.parseIntegerAttr = function(elem, attr) {

	var e = this.reader.getInteger(elem, attr, false);

	//errors
	if(e == null)
		this.error = "Attribute '" + attr + "' not found.";

	if( isNaN(e) )
		this.error = "Attribute '" + attr + "' value must be a float number.";

	return e;
}

MySceneGraph.prototype.parseIntegerAttrAsBoolean = function(elem, attr) {

	if ( !this.reader.hasAttribute(elem, attr, false) ) {
		this.error = "Attribute '" + attr + "' not found.";
		var e = null;
	}

	var e = this.reader.getInteger(elem, attr, false);

	//errors
	if (e == null || isNaN(e))
		this.error = "Attribute '" + attr + "' value must be an integer number.";

	return e;
}

MySceneGraph.prototype.parseItemAttr = function(elem, attr, array) {

	if(!this.reader.hasAttribute(elem, attr, false)) {
		this.error = "Attribute '" + attr + "' not found.";
		var e = null;
	}
	else {
		var e = this.reader.getItem(elem, attr, array, false);

		//errors
		if(e == null)
			this.error = "Value of axis is not a choice in [" + array + "].";
	}

	return e;
}

MySceneGraph.prototype.drawGraph = function () {

	for(i = 0; i < this.components.length; i++)
	{

		var node = new Node(this.components[i].id);

		var m = mat4.create();
		mat4.identity(m);

		// TRANSFORMATIONS
		for(t = 0; t < this.components[i].transformations.length; t++)
		{
			switch (this.components[i].transformations[t].type) {
				case "translate":
					this.translateMatrix(m, this.components[i].transformations[t].x, this.components[i].transformations[t].y, this.components[i].transformations[t].z);
					break;

				case "rotate":
					this.rotateMatrix(m, this.components[i].transformations[t].axis, this.components[i].transformations[t].angle);
					break;

				case "scale":
					this.scaleMatrix(m, this.components[i].transformations[t].x, this.components[i].transformations[t].y, this.components[i].transformations[t].z);
					break;

				default:
					return "Not a valid transformation.";
			}
		}

		// TRANSFORMATIONREF
		for(t = 0; t < this.transformations.length; t++)
		{
			if(this.transformations[t].id == this.components[i].transformationref) {

				for(k = 0; k < this.transformations[t].list.length; k++) {

					switch (this.transformations[t].list[k].type) {
						case "translate":
							this.translateMatrix(m, this.transformations[t].list[k].x, this.transformations[t].list[k].y, this.transformations[t].list[k].z);
							break;

						case "rotate":
							this.rotateMatrix(m, this.transformations[t].list[k].axis, this.transformations[t].list[k].angle);
							break;

						case "scale":
							this.scaleMatrix(m, this.transformations[t].list[k].x, this.transformations[t].list[k].y, this.transformations[t].list[k].z);
							break;

						default:
							return "Not a valid transformation.";
					}
				}
			}
		}

		node.setTransformations(m);

		console.log("--------- NODE " + i + " TRANSF ---------");

		console.log(node.transformations);

		console.log("------------------------");

		// MATERIALS

		for(k = 0; k < this.components[i].materials.length; k++) {

			var ref = this.components[i].materials[k];
			var curr = this.materials[ref.id];

			console.log("COMPONENT MATERIAL ID: " + this.components[i].materials[k]);
			console.log("MATERIAL ID: " + curr);

			node.addMaterial(curr);
		}
	}
}

MySceneGraph.prototype.translateMatrix = function(actual_matrix, x, y, z) {
	mat4.translate(actual_matrix, actual_matrix, [x, y, z]);
}

MySceneGraph.prototype.rotateMatrix = function(actual_matrix, axis, angle) {
	if(axis == "x" || axis == "X") {
		mat4.rotateX(actual_matrix, actual_matrix, angle);
	}
	else if (axis == "y" || axis == "Y") {
		mat4.rotateX(actual_matrix, actual_matrix, angle);
	}
	else if (axis == "z" || axis == "Z") {
		mat4.rotateX(actual_matrix, actual_matrix, angle);
	}
}

MySceneGraph.prototype.scaleMatrix = function(actual_matrix, x, y, z) {
	mat4.scale(actual_matrix, actual_matrix, [x, y, z]);
}
