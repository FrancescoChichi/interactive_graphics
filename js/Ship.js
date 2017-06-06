THREE.Ship = function (controls) {
	var scope = this;

	this.particleCount;
	this.particlesL;
	this.particlesR;
	    
	this.texture;
	this.material;
		
	this.group = new THREE.Group();
    

	var points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.5+0.5 , ( i - 5 ) * 0.1 ) );
	}
	var geometry = new THREE.LatheBufferGeometry( points );

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
		map: metalTexture
	} );

	var torusTexture = new THREE.TextureLoader().load( "textures/rubber.jpg" );
	torusTexture.repeat.set( 10, 1 );
	torusTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
	torusTexture.magFilter = THREE.NearestFilter;
	torusTexture.format = THREE.RGBFormat;


	var toruslMaterial = new THREE.MeshPhongMaterial( {
		shininess: 80,
		color: 0xffffff,
		specular: 0xffffff,
		map: torusTexture
	} );

	var glassMaterial = new THREE.MeshToonMaterial( {
		shininess: 10,
		color: 0x00ffff,
		specular: 0xffffff
			} );

	var sphereGeometry = new THREE.SphereBufferGeometry( 4.5, 64, 32 );

	var semiSphereGeometryL = new THREE.SphereBufferGeometry( 1, 64, 32 );
	var semiSphereGeometryR = new THREE.SphereBufferGeometry( 1, 64, 32 );

	var torusGeometry = new THREE.TorusBufferGeometry( 6, 2, 32, 64 );
	var cubeGeometry = new THREE.BoxBufferGeometry( 2, 2, 4 );
	var cilinderGeometry = new THREE.CylinderBufferGeometry( 1, 1, 3, 64);

	this.light = new THREE.PointLight( controls.color, 5, 5,2 );

		this.light.add( new THREE.Mesh( sphereGeometry, new THREE.MeshToonMaterial( { 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } ) ) );

		this.light.position.x = 0;
		this.light.position.y = 7;
		this.light.position.z = 0;


		//scene.add( this.light );
	var torus = addObject( torusGeometry, toruslMaterial, 0, 5, 0, Math.PI/2, 0, 0 );
	torus.name = "torus";
	this.group.add(torus);

	this.group.add(addObject( cubeGeometry, glassMaterial, 4, 9, 0, 0, 0, 0 ));
	this.group.add(addObject( cilinderGeometry, metalMaterial, -2, 8, 5.5, Math.PI/2, 0, Math.PI/2));
	this.group.add(addObject( cilinderGeometry, metalMaterial, -2, 8, -5.5, Math.PI/2, 0,Math.PI/2 ));
	this.group.add(addObject( geometry, metalMaterial, -3.8, 8, 5.5, 0, Math.PI, Math.PI/2 ));
	this.group.add(addObject( geometry, metalMaterial, -3.8, 8, -5.5, 0, Math.PI, Math.PI/2 ));
	this.group.add(addObject( semiSphereGeometryL, metalMaterial, -0.6, 8, -5.5, 0, Math.PI, Math.PI/2 ));
	this.group.add(addObject( semiSphereGeometryR, metalMaterial, -0.6, 8, 5.5, 0, Math.PI, Math.PI/2 ));
	//	this.group.add(addObject( sphereGeometry, metalMaterial, 0, 7, 0, 0, 0, 0 ));
	this.group.add(this.light);

	this.particleCount = 80;
  this.particlesL = [];
  this.particlesR = [];

  this.texture = THREE.ImageUtils.loadTexture("textures/oUBYu.png");
  this.material = new THREE.SpriteMaterial({
      color: 0xff4502, //0xff4502
      map: this.texture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
  });
  
  
  for (var i = 0; i < this.particleCount; i++) {
      var particle = new THREE.Sprite(this.material.clone());
      particle.scale.multiplyScalar(Math.random() * 4);

      particle.velocity = new THREE.Vector3( -Math.random(), 0, 0 );
      //particle.position.x=-;
      particle.position.y = 8;
      particle.position.z=-5.6;

      var particleR = particle.clone();
            particleR.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

      particleR.position.z=+5.6;


      this.particlesL.push(particle);
      this.group.add(particle);


      this.particlesR.push(particleR);
      this.group.add(particleR);

  }

	this.getShip = function(){
		return this.group;
	};
	

	function addObject( geometry, material, x, y, z, rx, ry, rz ) {
		var tmpMesh = new THREE.Mesh( geometry, material );
		//tmpMesh.material.color.offsetHSL( 0.1, -0.1, 0 );
		tmpMesh.position.set( x, y, z );
		tmpMesh.rotation.y = ry;
		tmpMesh.rotation.x = rx;
		tmpMesh.rotation.z = rz;

		tmpMesh.castShadow = true;
		tmpMesh.receiveShadow = true;
		//scene.add( tmpMesh );
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
	   	//particle.rotateY(Math.PI);

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
	   	//particle.rotateY(Math.PI);

	    particle.material.opacity -= 0.1;
	    particle.velocity.x -= 0.001;
	    particle.position.add(particle.velocity);
		}
	};
};