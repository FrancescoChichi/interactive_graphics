THREE.Ship = function (controls) {
	var scope = this;

	this.particleCount;
	this.particlesL;
	this.particlesR;
	    
	this.texture;
	this.material;
		
	this.group = new THREE.Group();
  this.ship = new THREE.Group();
  this.motors = new THREE.Group();
  this.motorL = new THREE.Group();
  this.motorR= new THREE.Group();
  this.cabin = new THREE.Group();


//MATERIALI
	var materialPhong = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, specular: 0x999999 } );
	var materialPlayer = new THREE.MeshToonMaterial( { shininess: 50, 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } );

	var metalTexture = new THREE.TextureLoader().load( "textures/metal-texture512.jpg" );
	metalTexture.repeat.set( 1, 1 );
	metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
	metalTexture.magFilter = THREE.NearestFilter;
	metalTexture.format = THREE.RGBFormat;


	var metalMaterial = new THREE.MeshPhongMaterial( {
		shininess: 80,
		color: 0xffffff,
		specular: 0xffffff,
		side: THREE.DoubleSide,
		map: metalTexture
	} );

	var torusTexture = new THREE.TextureLoader().load( "textures/halo.jpg" );
	torusTexture.repeat.set( 4, 1 );
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

	var glassMaterial = new THREE.MeshToonMaterial( {
		shininess: 10,
		color: 0x0000ff,
		specular: 0xffffff,
		reflectivity: 1
			} );

	/*this.cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );
	this.cubeCamera.position.x = 4;
	this.cubeCamera.position.y = 9;
	this.cubeCamera.position.z = 0;
	this.cubeCamera.rotateY(Math.PI);

	var mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: this.cubeCamera.renderTarget } );
*/
//GEOMETRY
	var points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.5+0.5 , ( i - 5 ) * 0.1 ) );
	}
	var geometry = new THREE.LatheBufferGeometry( points );

	var sphereGeometry = new THREE.SphereBufferGeometry( 4.5, 64, 32 );

	var semiSphereGeometryL = new THREE.SphereBufferGeometry( 1, 64, 32 );
	var semiSphereGeometryR = new THREE.SphereBufferGeometry( 1, 64, 32 );

	var torusGeometry = new THREE.TorusBufferGeometry( 6, 2, 32, 64 );
	var cubeGeometry = new THREE.BoxBufferGeometry( 2, 2, 4 );
	var cilinderGeometry = new THREE.CylinderBufferGeometry( 1, 1, 3, 64);

	this.light = new THREE.PointLight( controls.color, 5, 5, 2 );

	this.light.add( new THREE.Mesh( sphereGeometry, new THREE.MeshToonMaterial( { 
			color: controls.color,
			specular:0xFFFFFF,
			reflectivity: 1 } ) ) );

	this.light.position.x = 0;
	this.light.position.y = 7;
	this.light.position.z = 0;


	//CREAZIONE GRUPPI
		//scene.add( this.light );
	var torus = addObject( torusGeometry, toruslMaterial, 0, 5, 0, Math.PI/2, 0, 0 );
	torus.name = "torus";

	this.group.add(torus); //torus

	this.motorR.add(addObject( cilinderGeometry, metalMaterial, -2, 8, 5.5, Math.PI/2, 0, Math.PI/2)); //razzo DX
	this.motorL.add(addObject( cilinderGeometry, metalMaterial, -2, 8, -5.5, Math.PI/2, 0,Math.PI/2 )); //razzo SX
	this.motorR.add(addObject( geometry, metalMaterial, -3.8, 8, 5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo DX
	this.motorL.add(addObject( geometry, metalMaterial, -3.8, 8, -5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo SX
	this.motorR.add(addObject( semiSphereGeometryR, metalMaterial, -0.6, 8, 5.5, 0, Math.PI, Math.PI/2 )); //punta razzo DX
	this.motorL.add(addObject( semiSphereGeometryL, metalMaterial, -0.6, 8, -5.5, 0, Math.PI, Math.PI/2 )); //punta razzo SX

	this.motors.add(this.motorR);
	this.motors.add(this.motorL);
	this.ship.add(this.motors);
	this.group.add(this.ship);
	this.glass = addObject( cubeGeometry, glassMaterial, 4, 9, 0, 0, 0, 0 );
	this.cabin.add(this.glass); //vetro
	this.cabin.add(this.light); //palla di luce
	this.ship.add(this.cabin);

	this.particleCount = 120;
  this.particlesL = [];
  this.particlesR = [];

  this.texture = THREE.ImageUtils.loadTexture("textures/oUBYu.png");
  this.material = new THREE.SpriteMaterial({
      color: controls.color, //0xff4502
      map: this.texture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
  });
  
  
  for (var i = 0; i < this.particleCount; i++) {
      var particle = new THREE.Sprite(this.material.clone());
      particle.scale.multiplyScalar(Math.random() * 4);

      particle.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

      particle.position.y = 8;
      particle.position.z=-5.6;

      var particleR = particle.clone();
      particleR.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

      particleR.position.z=+5.6;


      this.particlesL.push(particle);
      this.motorL.add(particle);


      this.particlesR.push(particleR);
      this.motorR.add(particleR);
  }



	this.getShip = function(){
		return this.ship;
	};
	this.getCabin = function(){
		return this.cabin;
	}
	this.getMotors = function(){
		return this.motors;
	}
	this.getMotorL = function(){
		return this.motorL;
	}
	this.getMotorR = function(){
		return this.motorR;
	}
	this.getAll = function(){
		return this.group;
	}

	this.render = function(render, scene){
		/*this.glass.visible = false;
		//this.cubeCamera.position.copy( this.glass.position );
		this.cubeCamera.updateCubeMap( renderer, scene );
		this.glass.visible = true;*/
	}
	

	function addObject( geometry, material, x, y, z, rx, ry, rz ) {
		var tmpMesh = new THREE.Mesh( geometry, material );

		tmpMesh.position.set( x, y, z );
		tmpMesh.rotation.y = ry;
		tmpMesh.rotation.x = rx;
		tmpMesh.rotation.z = rz;

		tmpMesh.castShadow = true;
		tmpMesh.receiveShadow = true;

		return tmpMesh;
	};

	this.updateParticle = function(){
		for (var i = 0; i < this.particlesL.length; i++) {
	    var particle = this.particlesL[i];
	    if(particle.position.x < -10) {
	      particle.position.x = -4;
	      particle.velocity.x = -Math.random()-1;
	      particle.material.opacity = 1;
	    }

	    particle.material.opacity -= 0.1;
	    particle.velocity.x -= 0.001;
	    particle.position.add(particle.velocity);
		}

		for (var i = 0; i < this.particlesR.length; i++) {
	    var particle = this.particlesR[i];
	    if(particle.position.x < -10) {
	      particle.position.x = -4;
	      particle.velocity.x = -Math.random()-1;
	      particle.material.opacity = 1;
	    }

	    particle.material.opacity -= 0.1;
	    particle.velocity.x -= 0.001;
	    particle.position.add(particle.velocity);
		}
	};
};