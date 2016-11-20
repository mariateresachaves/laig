#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float dimU;
uniform float dimV;
uniform float selectedU;
uniform float selectedV;

varying vec2 vTextureCoord;

void main()
{
    if ( aTextureCoord.x > selectedU/dimU && aTextureCoord.x < (selectedU + 1.0)/dimU && (1.0 - aTextureCoord.y) > selectedV/dimV && (1.0 - aTextureCoord.y) < (selectedV + 1.0)/dimV )
	{
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y , aVertexPosition.z + 0.05, 1.0);
	}
	else
	{
	    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
	
    vTextureCoord = aTextureCoord;
}