THREE.explosionParticle = function (particlesNumber,position, color,wordRotation) {
	//var scope = this;

	this.particles = new THREE.Group();
	this.particlesDirection = [];

	var raggio = 20;
	
 	var material = new THREE.SpriteMaterial({
				      color: color,
				      map: new THREE.TextureLoader().load("textures/esplosione.png"),
				     transparent: true,
				      });

	  for (var i = 0; i < particlesNumber; i++) {

	  	  var materiale = material.clone();
	  	  materiale.rotation =  Math.random() * (Math.PI*2);
	      var particle  = new THREE.Sprite(materiale);

	      particle.scale.multiplyScalar(Math.random() * 4);

	      particle.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

	      particle.position.x =  position.x;
		  particle.position.y =  position.y;
		  particle.position.z =  position.z;
		  particle.rotation.set(Math.random() * Math.PI,Math.random() * Math.PI,Math.random() * Math.PI);
		  
		  var x = Math.random() * raggio;
		  x *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		  var z = Math.random() * raggio;
		  z *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		  var y = Math.random() * raggio;

		  var vec =new THREE.Vector3(x,y,z);
	      this.particlesDirection.push(vec);
	      this.particles.add(particle);
	      
	    }

	    this.particles.applyMatrix(wordRotation);
		scene.add(this.particles);

		this.render = function(animationStep){
		for (var i = this.particles.children.length - 1; i >= 0; i--) {

			var matrice = new THREE.Matrix4().makeTranslation(
				(this.particlesDirection[i].x)/animationStep,
				(this.particlesDirection[i].y)/animationStep,
				(this.particlesDirection[i].z)/animationStep);

			//matrice.scale(new THREE.Vector3(1.005,1.005,1.005));

			this.particles.children[i].applyMatrix(matrice);

			};
		};

		this.remove = function()
		{
			scene.remove(this.particles);
		};

};