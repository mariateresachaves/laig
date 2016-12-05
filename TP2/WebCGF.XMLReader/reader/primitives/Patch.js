/**
 * Patch
 * @param orderU order of the surface curves in the direction u.
 * @param orderV order of the surface curves in the direction v.
 * @param partsU number of divisions in the direction u.
 * @param partsV number of divisions in the direction v.
 * @param controlPoints control points.
 * @constructor
 */
function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
    var knotsX = this.getKnotsVector(orderU);
    var knotsY = this.getKnotsVector(orderV);

    var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsX, knotsY, controlPoints);

    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

/**
 * Returns the knots vector.
 * @param degree order of the curve.
 */
Patch.prototype.getKnotsVector = function(degree) {
	var v = new Array();

	for (var i=0; i<=degree; i++) {
		v.push(0);
	}

	for (var i=0; i<=degree; i++) {
		v.push(1);
	}

	return v;
};