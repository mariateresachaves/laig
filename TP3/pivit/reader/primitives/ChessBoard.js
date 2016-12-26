/**
 * ChessBoard
 * @param du dimension in u.
 * @param dv dimension in v.
 * @param textureref reference his background texture.
 * @param su selected position in u.
 * @param sv selected position in v.
 * @param c1 rgba primary color.
 * @param c2 rgba secondary color.
 * @param cs rgba selected color.
 * @constructor
 */
function ChessBoard(scene, du, dv, textureref, su, sv, c1, c2, cs) {
    CGFobject.call(this, scene);

    this.scene = scene;
	
	this.plane = new Plane(this.scene, 1, 1, du*5, dv*5);
		
	this.texture = this.scene.graph.textures[textureref].CGFtexture;

	this.shader = new CGFshader(this.scene.gl, "shaders/chess.vert", "shaders/chess.frag");
    this.shader.setUniformsValues(
		{
			uSample : 0,
			color1 : c1,
			color2 : c2,
			colorSelected : cs,
			dimU : parseInt(du)*1.0,
			dimV: parseInt(dv)*1.0,
			selectedU: parseInt(su)*1.0,
			selectedV: parseInt(sv)*1.0
		}
	);
}

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

/**
 * ChessBoard display function.
 */
ChessBoard.prototype.display = function() {

    this.scene.setActiveShader(this.shader);

	this.scene.pushMatrix();
    this.texture.bind(0);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader);
}