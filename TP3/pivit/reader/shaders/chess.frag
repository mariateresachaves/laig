#ifdef GL_ES
precision highp float;
#endif

uniform float isSelected;
uniform float isValidMove;
uniform vec4 color;
uniform vec4 colorSelected;
uniform vec4 colorValidMove;

void main()
{
	vec4 color;

    if ( isSelected > 0.5 )
	{
		color.rgba = colorSelected;		
	}
    else if ( isValidMove > 0.5)
	{
		color.rgba = colorValidMove;	
	}
    else
	{
		color.rgba = color;
		color.rgba = vec4(0.0, 0.0, 0.0, 0.0);
	}

    gl_FragColor = color;
}