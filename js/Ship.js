THREE.Ship = function (controls,scale) {
	var scope = this;
	var deathAnimationFrameCounter = 0;
	var deathAnimationFrame = 100;
	var particleCount = 25;
	var explosionParticleNumber = 100;
	var explosionParticle;

	var particlesL;
	var particlesR;
	    
	var texture;
	var material;
		
  var group = new THREE.Group();
  var topShip = new THREE.Group();
  var motors = new THREE.Group();
  var motorL = new THREE.Group();
  var motorR= new THREE.Group();
  var cabin = new THREE.Group();
  

//MATERIALI
	var materialPhong = new THREE.MeshPhongMaterial( { shininess: 5, color: 0xffffff, specular: 0x999999 } );
	var materialPlayer = new THREE.MeshToonMaterial( { shininess: 5, 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } );


	var metalMaterial = new Material(50,0xffffff,3,1).metalDoubleSide;
	var metalBallMaterial = new Material(50,controls.color,1,1).metalDoubleSide;
	var toruslMaterial = new Material(2,	0xffffff,10,5).torus;
	var glassMaterial =new Material(0,controls.color).glass;

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
	var cilinderGeometry = new Geometry([1, 1, 3, 64]).cylinder;

	var light = new THREE.PointLight( controls.color, 5, 5, 2 );
  var ball = new THREE.Mesh( sphereGeometry, metalBallMaterial);
	light.add( ball );
	light.position.x = 0;
	light.position.y = 7;
	light.position.z = 0;


	//CREAZIONE GRUPPI
	var torus = addObject( torusGeometry, toruslMaterial, 0, 5, 0, Math.PI/2, 0, 0 );
	torus.name = "torus";

	group.add(torus); //torus

	motorR.add(addObject( cilinderGeometry, metalMaterial, -2, 8, 5.5, Math.PI/2, 0, Math.PI/2)); //razzo DX
	motorL.add(addObject( cilinderGeometry, metalMaterial, -2, 8, -5.5, Math.PI/2, 0,Math.PI/2 )); //razzo SX
	motorR.add(addObject( geometry, metalMaterial, -3.8, 8, 5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo DX
	motorL.add(addObject( geometry, metalMaterial, -3.8, 8, -5.5, 0, Math.PI, Math.PI/2 )); //cono fondo razzo SX
	motorR.add(addObject( semiSphereGeometryR, metalMaterial, -0.6, 8, 5.5, 0, Math.PI, Math.PI/2 )); //punta razzo DX
	motorL.add(addObject( semiSphereGeometryL, metalMaterial, -0.6, 8, -5.5, 0, Math.PI, Math.PI/2 )); //punta razzo SX

	motors.add(motorR);
	motors.add(motorL);
	motors.name = 'motors';
	topShip.add(motors);
	group.add(topShip);

	glass = addObject( cubeGeometry, glassMaterial, 4, 9, 0, 0, 0, 0 );
	cabin.add(glass); //vetro

	cabin.add(light); //palla di luce
	topShip.position.y=1;
	topShip.add(cabin);

  particlesL = [];
  particlesR = [];


  var particleMaterial = new Material(0,controls.color).particle;

  for (var i = 0; i < particleCount; i++) {

      var particle = new THREE.Sprite(particleMaterial);
      particle.scale.multiplyScalar(Math.random() * 4);

      particle.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

      particle.position.y = 8;
      particle.position.z=-5.6;

      var particleR = particle.clone();
      particleR.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

      particleR.position.z=+5.6;


      particlesL.push(particle);
      motorL.add(particle);


      particlesR.push(particleR);
      motorR.add(particleR);
  }

  	group.scale.set(scale, scale, scale);
 	 var shipScale = group.scale;

 	
	this.getShip = function(){
		return topShip;
	};
	this.getCabin = function(){
		return cabin;
	}
	this.getMotors = function(){
		return motors;
	}
	this.getMotorL = function(){
		return motorL;
	}
	this.getMotorR = function(){
		return motorR;
	}
	this.getAll = function(){
		return group;
	}
	this.changeColor = function(color){
		
		glass.material.color = color;
		light.color = color;
		ball.material.color = color;


	  for (var i = 0; i < particlesL.length; i++) 
	  	particlesL[i].material.color = color;
	  for (var i = 0; i < particlesR.length; i++) 
	  	particlesR[i].material.color = color;

	}
	this.render = function(control, angle, sound){

		if(control.alive)
		{
			group.position.y =Math.min( Math.sin( time*5 ) + 1 ,1.3);
			group.getObjectByName("torus").rotateZ(THREE.Math.degToRad(angle));
			this.updateParticle();
		}
		else
		{
			if (deathAnimationFrameCounter== 0)
			{
				if (sound.music>0)
					sound.death_sound.play();
				explosionParticle = new THREE.explosionParticle(explosionParticleNumber,controls.color,group.matrixWorld,group.getWorldPosition() , planeWidth,planeHeight);
			}
			deathAnimationFrameCounter++;

			if(deathAnimationFrameCounter>deathAnimationFrame){
				this.remove();
				explosionParticle.remove();
				return true;
			}

			explosionParticle.render(deathAnimationFrame*explosionParticleNumber);
		
			cabin.position.y++;
			cabin.rotateZ(THREE.Math.degToRad(-5));

			motorR.position.x++;
			motorL.position.x++;

			for (var i = 0; i < control.walls.length; i++) {
				control.walls[i].scale.y -= (1/deathAnimationFrame)
			};

			scale = 1/deathAnimationFrame;
			var scale = new THREE.Vector3();
			scale.addScaledVector(shipScale,-1/deathAnimationFrame);
			
			group.scale.add(scale);
			
			if (group.getObjectByName("torus").position.y>=-group.position.y*1.5)
				group.getObjectByName("torus").position.y--;
		}
		return false;

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

		for (var i = 0; i < particlesL.length; i++) {

		    var particle = particlesL[i];


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

		for (var i = 0; i < particlesR.length; i++) {
		    var particle = particlesR[i];
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

	this.remove = function(controls)
	{
	group.scale.copy(new THREE.Vector3(0.0001,0.0001,0.0001));
	};
};