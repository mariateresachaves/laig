#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;

uniform float dimU;
uniform float dimV;
uniform float selectedU;
uniform float selectedV;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 colorSelected;

varying vec2 vTextureCoord;

void main()
{
	vec4 color = texture2D(uSampler, vTextureCoord);

    if ( vTextureCoord.x > selectedU/dimU && vTextureCoord.x < (selectedU + 1.0)/dimU && (1.0 - vTextureCoord.y) > selectedV/dimV && (1.0 - vTextureCoord.y) < (selectedV+1.0)/dimV )
	{
		color.rgba *= colorSelected;		
	}
    else if ( mod(dimU*vTextureCoord.x,2.0) < 1.0 ^^ mod(dimV*vTextureCoord.y,2.0) < 1.0)
	{
		color.rgba *= color1;	
	}
    else
	{
		color.rgba *= color2;
	}

    gl_FragColor = color;
}