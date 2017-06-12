THREE.Ship = function (controls) {
	var scope = this;

	this.particleCount;
	this.particlesL;
	this.particlesR;
	    
	this.texture;
		
	this.group = new THREE.Group();
  this.ship = new THREE.Group();
  this.motors = new THREE.Group();
  this.motorL = new THREE.Group();
  this.motorR= new THREE.Group();
  this.cabin = new THREE.Group();


//MATERIALI
	var materialPhong = new THREE.MeshPhongMaterial( { shininess: 5, color: 0xffffff, specular: 0x999999 } );
	var materialPlayer = new THREE.MeshToonMaterial( { shininess: 5, 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } );


	var motorMaterial = new Material(50,0xffffff,0xffffff,1,1).metalDoubleSide;
	var metalBallMaterial = new Material(50,controls.color,controls.color,5,1).metalDoubleSide;
	var toruslMaterial = new Material(5,0xffffff,0xffffff,4,1).halo;
	var glassMaterial =new Material(0,controls.color,controls.color).glass;

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
	//var cilinderGeometry = new THREE.CylinderBufferGeometry( 1, 1, 3, 64);
	var cilinderGeometry = new Geometry([1, 1, 3, 64]).cylinder;

	this.light = new THREE.PointLight( controls.color, 5, 5, 2 );

	this.light.add( new THREE.Mesh( sphereGeometry, metalBallMaterial));
		/*new THREE.MeshToonMaterial( { 
			color: controls.color,
			specular:0xFFFFFF,
			reflectivity: 1 } ) ) );*/

	this.light.position.x = 0;
	this.light.position.y = 7;
	this.light.position.z = 0;


	//CREAZIONE GRUPPI
	//	scene.add( this.light );
	var torus = addObject( torusGeometry, toruslMaterial, 0, 5, 0, Math.PI/2, 0, 0 );
	torus.name = "torus";

	this.group.add(torus); //torus

	this.motorR.add(addObject( cilinderGeometry, motorMaterial, -2, 8, 5.5, Math.PI/2, 0, Math.PI/2)); //razzo DX
	this.motorL.add(addObject( cilinderGeometry, motorMaterial, -2, 8, -5.5, Math.PI/2, 0,Math.PI/2 )); //razzo SX
	this.motorR.add(addObject( geometry, motorMaterial, -3.8, 8, 5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo DX
	this.motorL.add(addObject( geometry, motorMaterial, -3.8, 8, -5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo SX
	this.motorR.add(addObject( semiSphereGeometryR, motorMaterial, -0.6, 8, 5.5, 0, Math.PI, Math.PI/2 )); //punta razzo DX
	this.motorL.add(addObject( semiSphereGeometryL, motorMaterial, -0.6, 8, -5.5, 0, Math.PI, Math.PI/2 )); //punta razzo SX

	this.motors.add(this.motorR);
	this.motors.add(this.motorL);
	this.ship.add(this.motors);
	this.group.add(this.ship);


	this.glass = addObject( cubeGeometry, glassMaterial, 4, 9, 0, 0, 0, 0 );
	//this.cabin.add(this.cubeCamera);

	this.cabin.add(this.glass); //vetro
	this.cabin.add(this.light); //palla di luce
	this.ship.add(this.cabin);

	this.particleCount = 50;
  this.particlesL = [];
  this.particlesR = [];


  var particleMaterial = new Material(0,controls.color,0,0,0).particle;

  
  
  for (var i = 0; i < this.particleCount; i++) {
      var particle = new THREE.Sprite(particleMaterial);
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

	this.render = function(angle){
		this.group.position.y = Math.sin( time*5 ) + 1.3 ;

		ship.getObjectByName("torus").rotateZ(THREE.Math.degToRad(angle));

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
var caso = 10;
	this.updateParticle = function(){
		for (var i = 0; i < this.particlesL.length; i++) {
	    var particle = this.particlesL[i];
	    if (Math.random() > 0.8)
	    	caso = 40;
	    else if (Math.random() < 0.1)
	    	caso = 0;
	    else 
	    	caso = 10;
	    if(particle.position.x < -caso) {
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
	    if (Math.random() > 0.8)
	    	caso = 40;
	    else if (Math.random() < 0.1)
	    	caso = 0;
	    else 
	    	caso = 10;
	    if(particle.position.x < -caso) {
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