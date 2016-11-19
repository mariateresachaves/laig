/**
 * Plane
 *
 * @constructor
 */
function Plane(scene, dimX, dimY, partsX, partsY) {

    var knotsX = this.getKnotsVector(partsX); // to be built inside webCGF in later versions
    var knotsY = this.getKnotsVector(partsY); // to be built inside webCGF in later versions

    //TODO : estava a fazer esta parte

    var nurbsSurface = new CGFnurbsSurface(dimX, dimY, knotsX, knotsY, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.

    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    var obj = new CGFnurbsObject(this, scene, getSurfacePoint, partsX, partsY);
    this.surfaces.push(obj);
};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;

//--- Get Knots Vector
Plane.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

    var v = new Array();

    for (var i=0; i<=degree; i++) {
        v.push(0);
    }

    for (var i=0; i<=degree; i++) {
        v.push(1);
    }

    return v;
}