/**
 * Patch
 * @param orderU control points of the direction in u (ordered list).
 * @param orderV control points of the direction in v (ordered list).
 * @param partsU parts number in u.
 * @param partsV parts number in v.
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
 * @param degree ordered list of control points.
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