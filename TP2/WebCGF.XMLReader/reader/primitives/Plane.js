/**
 * Plane
 *
 * @constructor
 */
function Plane(scene, dimX, dimY, partsX, partsY) {

    var knotsX = [0, 0, 1, 1];
    var knotsY = [0, 0, 1, 1];

	var controlPoints= [
		[
			[-dimX/2, -dimY/2, 0, 1 ],
			[-dimX/2,  dimY/2, 0, 1 ]
		],
						
		[
			[ dimX/2, -dimY/2, 0, 1 ],
			[dimX/2, dimY/2, 0, 1 ]
		]
	];

    var nurbsSurface = new CGFnurbsSurface(1, 1, knotsX, knotsY, controlPoints);

    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;