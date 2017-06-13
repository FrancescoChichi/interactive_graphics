THREE.Halo = function (size) {
	var scope = this;

	this.group = new THREE.Group();
	this.lightOn = true;
	var dimension = size*2 ;
	var vectorAngle = new THREE.Vector3(0,0,1);
	//TORUS
	var geom = new THREE.TorusBufferGeometry( size, 1, 32, 64 );
	//this.group.matrixAutoUpdate=false
	this.group.add(new THREE.Mesh(geom,new Material(1,0xffffff,100,1).halo));

	this.lightSun = new THREE.SpotLight( 0xffffff, 1,size);
	this.lightSun.decay = 0.0;
	this.lightSun.angle = 	Math.PI/2;
	this.lightSun.position.set( 0, size, 0 );
	this.group.add(this.lightSun);

	this.lightMoon = new THREE.SpotLight( 0x0000cc, 1,size);
	this.lightMoon.position.set( 0, -size, 0 );
	this.lightMoon.decay = 0.0;
	this.lightMoon.angle = 	Math.PI/2;

	this.group.add(this.lightMoon);

	//this.group.position.y+=100;

	//this.group.rotateY(THREE.Math.degToRad(+45));
	
	//this.group.rotateX(Math.PI/6);
	//this.group.rotateZ(THREE.Math.degToRad(+45));

	this.getTorus = function(){
		return this.group;
	};
	this.rotateHalo = function(rad){
		this.group.rotateZ(rad);
	}
	this.switchLight = function(){
		this.lightOn = !this.lightOn;
	}

	this.animate = function(){
			this.group.rotateZ(THREE.Math.degToRad(-0.5));
	};
};
