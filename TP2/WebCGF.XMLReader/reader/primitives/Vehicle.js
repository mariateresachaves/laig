/**
 * Cylinder
 * 
 * @constructor
 */
function Vehicle(scene) {
	CGFobject.call(this,scene);
	
	var controlPoints = [
		[
			[0, 0, 1, 1 ],
			[0, 0.1, 1, 1 ],
			[0, 0.5, 1, 1 ],
			[0, 0.9, 1, 1 ],
			[0, 1, 1, 1 ]
		],
		[
			[0.1, 0, 1, 1 ],
			[0.1, 0.1, 0, 1 ],
			[0.1, 0.5, 0, 1 ],
			[0.1, 0.9, 0, 1 ],
			[0.1, 1, 1, 1 ]
		],
		[
			[1, 0, 1, 1 ],
			[1, 0.1, 0, 1 ],
			[1, 0.5, 0, 1 ],
			[1, 0.9, 0, 1 ],
			[1, 1, 1, 1 ]
		],
		[
			[1.9, 0, 1, 1 ],
			[1.9, 0.1, 0, 1 ],
			[1.9, 0.5, 0, 1 ],
			[1.9, 0.9, 0, 1 ],
			[1.9, 1, 1, 1 ]
		],
		[
			[2, 0, 1, 1 ],
			[2, 0.1, 1, 1 ],
			[2, 0.5, 1, 1 ],
			[2, 0.9, 1, 1 ],
			[2, 1, 1, 1 ]
		]
	];
	
	this.body = new Patch(this.scene, 4, 4, 20, 20, controlPoints)
	this.axis = new Cylinder(this.scene, 0.03, 0.03, 1, 20, 10);
	this.whell = new Cylinder(this.scene, 0.2, 0.2, .06, 20, 1);

};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

Vehicle.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2,0,1,0);
	this.scene.translate(-1,0,0.5);
	this.scene.rotate(-Math.PI/2,1,0,0);
		
	//cart body
	this.scene.pushMatrix();
	this.scene.translate(2,0,-0.35);
	this.scene.scale(-1,1,1);
	this.body.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.translate(0,0,-0.35);
	this.body.display();
	this.scene.popMatrix();
	
	//axis1
	this.scene.pushMatrix();
	this.scene.translate(0.4,0,0);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.axis.display();
	this.scene.popMatrix();
	
	//axis2
	this.scene.pushMatrix();
	this.scene.translate(1.6,0,0);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.axis.display();
	this.scene.popMatrix();
	
	//whell1
	this.scene.pushMatrix();
	this.scene.translate(0.4,0.05,0);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.whell.display();
	this.scene.popMatrix();
	
	//whell2
	this.scene.pushMatrix();
	this.scene.translate(0.4,0.95,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.whell.display();
	this.scene.popMatrix();
	
	//whell3
	this.scene.pushMatrix();
	this.scene.translate(1.6,0.05,0);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.whell.display();
	this.scene.popMatrix();
	
	//whell4
	this.scene.pushMatrix();
	this.scene.translate(1.6,0.95,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.whell.display();
	this.scene.popMatrix();	

	this.scene.popMatrix();
};



