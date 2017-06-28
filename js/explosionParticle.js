THREE.explosionParticle = function (particlesNumber, color,wordRotation,position,planeWidth,planeHeight) {
	
	this.particles = new THREE.Group();
	this.particles.position.copy(position);
	this.particlesDirection = [];
	this.curveDirection = [];
	this.curvePosition = 0;
	var particleScale = 0.6;

	var radius = 40;
	
 	var material = new THREE.SpriteMaterial({
				      color: color,
				      map: new THREE.TextureLoader().load("textures/esplosione.png"),
				     transparent: false,
				     opacity:1.0
				      });
	      
	      this.particles.matrixAutoUpdate=false;

	  for (var i = 0; i < particlesNumber; i++) {

	  	  var materiale = material.clone();
	  	  materiale.rotation =  Math.random() * (Math.PI*2);
	      var particle  = new THREE.Sprite(materiale);
	      particle.position.copy(position);
		  particle.scale.copy(new THREE.Vector3(particleScale,particleScale,particleScale));
	      this.particles.add(particle);

		  var position = this.particles.position;
		  position.setComponent(1, 0);
		  var x = Math.random() * radius*2;
		  var mul = Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		  x *= mul;

		  var z = Math.random() * radius*2;
		  mul= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		  z *= mul;

		  var y = -5;
		  var vec =new THREE.Vector3(x,y,z);

		  var midPoint1 = new THREE.Vector3();
		  midPoint1.addVectors(vec,position);
		  midPoint1.setComponent(1, Math.random() * (radius));
		  midPoint1.multiplyScalar (0.50);

		  var curve = new  THREE.CatmullRomCurve3([position,midPoint1,vec]);
		  curve.closed = false;
		  curve.type = 'catmullrom'
			this.curveDirection.push(curve);

			
		   var geometry = new THREE.Geometry();
			geometry.vertices.push(position);
			geometry.vertices.push(midPoint1);
			geometry.vertices.push(vec);

	 		var line = new THREE.Line(geometry,  new THREE.LineBasicMaterial({
	        color: color,
	    }));
			
		    }
			gameScene.add(this.particles);

		this.render = function(animationStep){

		for (var i = this.particles.children.length - 1; i >= 0; i--) {

			var pos = this.curveDirection[i].getPoint(this.curvePosition);
			this.particles.children[i].position.copy(pos);
			var offset = 1/animationStep;	
			this.curvePosition+=(offset);

			if (this.curvePosition > 1)
				this.curvePosition=1;
			}
		};

		this.remove = function()
		{
			gameScene.remove(this.particles);
		};

};