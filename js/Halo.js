THREE.Halo = function (size) {
	var scope = this;

	this.group = new THREE.Group();

	var dimension = size*2 ;
	//TORUS
	var geom = new THREE.TorusBufferGeometry( dimension, 1, 32, 64 );
	//var material = new THREE.MeshBasicMaterial( {
			//	color: 0xff3300 });
	var torusTexture = new THREE.TextureLoader().load( "textures/halo.jpg" );
	torusTexture.repeat.set( 100, 1 );
	torusTexture.wrapS = torusTexture.wrapT = THREE.RepeatWrapping;
	torusTexture.magFilter = THREE.NearestFilter;
	torusTexture.format = THREE.RGBFormat;


	var toruslMaterial = new THREE.MeshPhongMaterial( {
		shininess: 80,
		//color: 0x0000ff,
		reflectivity: 1,
		specular: 0xffffff,
		map: torusTexture
	} );

	this.group.add(new THREE.Mesh(geom,toruslMaterial));

	var light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( 0, dimension, 0 );
	this.group.add(light);

//	this.group.position.y+=100;
	this.group.rotateY(THREE.Math.degToRad(+45));

	this.group.rotateX(Math.PI/6);
	this.group.rotateZ(THREE.Math.degToRad(+45));

	this.getTorus = function(){
		return this.group;
	};

	this.animate = function(){
		this.group.rotateZ(THREE.Math.degToRad(-0.5));
	};
};
