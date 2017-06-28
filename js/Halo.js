THREE.Halo = function (size) {
	var scope = this;

	var group = new THREE.Group();
	var dimension = size*2 ;
	var vectorAngle = new THREE.Vector3(0,0,1);
	var geom = new THREE.TorusBufferGeometry( size, 1, 32, 64 );
	group.add(new THREE.Mesh(geom,new Material(1,0xffffff,100,1).halo));

	var lightSun = new THREE.SpotLight( 0xffffff, 1,size);
	lightSun.decay = 0.0;
	lightSun.angle = 	Math.PI/2;
	lightSun.position.set( 0, size, 0 );
	group.add(lightSun);

	var lightMoon = new THREE.SpotLight( 0x0000cc, 0.5,size);
	lightMoon.position.set( 0, -size, 0 );
	lightMoon.decay = 0.0;
	lightMoon.angle = 	Math.PI/2;

	group.add(lightMoon);

	this.getTorus = function(){
		return group;
	};
	this.rotateHalo = function(rad){
		group.rotateZ(rad);
	}

	this.animate = function(){
			group.rotateZ(THREE.Math.degToRad(-0.5));
	};
};