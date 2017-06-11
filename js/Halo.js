THREE.Halo = function (size) {
	var scope = this;

	this.group = new THREE.Group();
	this.lightOn = true;
	var dimension = size*2 ;
	//TORUS
	var geom = new THREE.TorusBufferGeometry( dimension, 1, 32, 64 );
	//var material = new THREE.MeshBasicMaterial( {
			//	color: 0xff3300 });

	this.group.add(new THREE.Mesh(geom,new Material(5,0xffffff,0xffffff,100,1).halo));

	this.lightSun = new THREE.DirectionalLight( 0xffffff, 1.5 );
	this.lightSun.position.set( 0, dimension, 0 );
	this.group.add(this.lightSun);

	this.lightMoon = new THREE.DirectionalLight( 0x0000cc, 1.5 );
	this.lightMoon.position.set( 0, -dimension, 0 );
	this.group.add(this.lightMoon);
//	this.group.position.y+=100;

	this.group.rotateY(THREE.Math.degToRad(+45));
	

	this.group.rotateX(Math.PI/6);
	this.group.rotateZ(THREE.Math.degToRad(+45));

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
