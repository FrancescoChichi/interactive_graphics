THREE.explosionParticle = function (particlesNumber,position, color,wordRotation) {
	//var scope = this;

	this.particles = new THREE.Group();
	this.particlesDirection = [];

	var raggio = 50;
	var maxEx = raggio;
	var minEx = -raggio;
	
 	var material = new THREE.SpriteMaterial({
				      color: 0xff4502,
				      map: THREE.ImageUtils.loadTexture("textures/esplosione.png"),
				      transparent: true,
				      blending: THREE.AdditiveBlending});

	  for (var i = 0; i < particlesNumber; i++) {

	      var particle  = new THREE.Sprite(material.clone());

	      particle.scale.multiplyScalar(Math.random() * 4);

	      particle.velocity = new THREE.Vector3( -Math.random(), 0, 0 );

	      particle.position.x =  position.x;
		  particle.position.y =  position.y;
		  particle.position.z =  position.z;
		  
		 
		  var vec =new THREE.Vector3(
	 	    (Math.random() * (maxEx-minEx+1))+minEx,
			(Math.abs(Math.random() * (maxEx-minEx+1))+minEx),
			(Math.random() * (maxEx-minEx+1))+minEx);

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
			//console.log(wordRotation);
			//matrice.multiply(wordRotation);
			//console.log(matrice);
			//this.particles.children[i].applyMatrix(matrice);
			this.particles.children[i].applyMatrix(matrice);
			};
		};

		this.remove = function()
		{
			scene.remove(this.particles);
		};

};