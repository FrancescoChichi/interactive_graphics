THREE.Player = function (controls, planeWidth, planeHeight, playerN) {
	
	var scope = this;
	
	this.deathAnimationFrame = 0;
	this.wallHeight = 2;
	this.wallY = 2;

	var position = [0,controls.dimension,0];
	var rotation = [- Math.PI / 2, 0,0];


	this.player = new THREE.Ship(controls);
	this.ship = this.player.getAll();


	switch( playerN ) {
			case 0: // player 1
				position[0] = planeWidth/3;
				position[2] = 0;
				this.orientation = new THREE.Vector3(-1,0,0);
				this.ship.rotateY(Math.PI);
				break;
			
			case 1: // player 2
				position[0] = 0;
				position[2] = planeWidth/3;
				this.orientation = new THREE.Vector3(0,0,-1);
				this.ship.rotateY(Math.PI/2);

				break;
				
			case 2: // player 3
				position[0] = -planeWidth/3;
				position[2] = 0;
				this.orientation = new THREE.Vector3(1,0,0);

				break;
			
			case 3: // player 4
				position[0] = 0;
				position[2] = -planeWidth/3;
				this.orientation = new THREE.Vector3(0,0,1);
				this.ship.rotateY(-Math.PI/2);


				break;
		}
		
		var scale = 0.25;
		this.ship.position.x = position[0];
		this.ship.position.y = position[1];
		this.ship.position.z = position[2];
		this.ship.scale.set(scale, scale, scale);
		gameScene.add(this.ship);
		this.ship.updateMatrixWorld();





		this.torus = new THREE.Box3().setFromObject(this.player.getCabin()	);


		this.boxOgetto = this.torus.clone();

		this.wallMaterial = new Material(0,controls.color,0,0.8).basicTransparent;

		this.turn = false;


		var size = this.boxOgetto.getSize();

		var geometry = new THREE.BoxBufferGeometry( size.x/2, size.y, size.z/2 );

		var x = this.ship.position.x;//+1*this.orientation.x;
		var y =0;
		var z = this.ship.position.z;//+1*this.orientation.z;
		
		this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z)
			, new THREE.Vector3(size.x/3,size.y,size.z/1.5));

		var bz = this.torus.clone();
		controls.boxTesta = bz;
		var centro = bz.getCenter();

		this.poseBK = this.ship.position.clone();


		this.ry = new THREE.Matrix3();
		this.ry.set(0.0, 0.0, -1.0,
					0.0, 1.0, 0.0,
					1.0, 0.0,  0.0);

		this.ryt =new THREE.Matrix3();
		this.ryt.set(0.0, 0.0, 1.0,
					0.0, 1.0, 0.0,
					-1.0, 0.0,  0.0);

	this.death = function(controls)
	{
		controls.alive=false;


		gameScene.remove(this.ship);

		for (var i = 0; i < controls.walls.length; i++) 
			gameScene.remove(controls.walls[i]);
	}

	this.render = function(time, controls, sound, music){
		if (controls.alive){ //ANIMAZIONE MOVIMENTO UFO
			this.player.render(-1.5);
		}
		else{
			this.deathAnimationFrame++;
			this.player.getCabin().position.y++;
			this.player.getCabin().position.x++;
			this.player.getCabin().rotateZ(THREE.Math.degToRad(-5));

			this.player.getMotorL().position.x++;
			this.player.getMotorR().position.x++;

			for (var i = 0; i<controls.walls.length; i++)
				if (controls.walls[i].scale.y >= 0 )
					controls.walls[i].scale.y -= 0.1;

			if (this.ship.scale.x>=0)
				this.ship.scale.x -= 0.001;
			if (this.ship.scale.y>=0)
				this.ship.scale.y -= 0.001;
			if (this.ship.scale.z>=0)
				this.ship.scale.z -= 0.001;

			if (this.ship.getObjectByName("torus").position.y>=-this.ship.position.y*1.5)
				this.ship.getObjectByName("torus").position.y--;

			if(this.deathAnimationFrame>100){
				this.death(controls);
				if (music > 0)
					sound.death_sound.play();
				return true;
			}

		}
		return false;
	}

	this.getPosition = function (){
		return this.ship.position;
	}
	this.getOrientation = function(){
		return this.orientation;
	}
	this.updatePlayerModel = function ( controls, gameScene, planeWidth, planeHeight, sound ) {
		//GIRA A SINISTRA
		this.torus = new THREE.Box3().setFromObject(this.player.getCabin());

		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation.applyMatrix3(this.ry);
			controls.leftClicked++;
			this.poseBK = this.ship.position.clone();
			this.turn = true;
			this.ship.rotateY(-Math.PI/2);
		}

		//GIRA A DESTRA
		else if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation.applyMatrix3(this.ryt);
			controls.rightClicked++;
			this.poseBK = this.ship.position.clone();
			this.turn = true;
			this.ship.rotateY(+Math.PI/2);
		}

		//AVANZA NELLA DIREZIONE AGGIORNATA

		this.ship.position.x=this.ship.position.x+(this.orientation.x*controls.velocity);
		this.ship.position.z=this.ship.position.z+(this.orientation.z*controls.velocity);

		this.player.updateParticle();

		this.ship.getObjectByName("torus").rotateZ(THREE.Math.degToRad(-1.5));

		//SE IL GIOCATORE È USCITO, MUORE
		if (Math.abs(this.ship.position.x)>planeWidth/2 || Math.abs(this.ship.position.z)>planeHeight/2 )
		{
			this.death(controls, sound);
		}
		else
		{
			var geometry = 0;

			if ( this.turn ) 
			{

				//MI STO MUOVENDO LUNGO L'ASSE Z
				var  com = new THREE.Vector3() ;
				com.addVectors (this.ship.position,this.poseBK);
				com.divideScalar(2); 

				if(this.orientation.z!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							this.wallHeight,
							Math.abs(this.ship.position.z - this.poseBK.z)+controls.wallThickness
						);
				}
				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.ship.position.x - this.poseBK.x)+controls.wallThickness,
							this.wallHeight,
							controls.wallThickness
						);
				}	
				geometry.translate(com.x,this.wallY,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;

				controls.boxWall.push(bz);

				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				gameScene.add(cube);
				controls.walls.push(cube);

			}

			else
			{
				gameScene.remove(controls.walls.pop());
				controls.boxWall.pop();

				var  com = new THREE.Vector3() ;
				com.addVectors (this.ship.position,this.poseBK);
				com.divideScalar(2); 
				if(this.orientation.z!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							this.wallHeight,
							Math.abs(this.ship.position.z - this.poseBK.z)+controls.wallThickness
						);
				}	

				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.ship.position.x - this.poseBK.x)+controls.wallThickness,
							this.wallHeight,
							controls.wallThickness
						);
				}

				geometry.translate(com.x,this.wallY,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;
				controls.boxWall.push(bz);

				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				gameScene.add(cube);
				controls.walls.push(cube);

			}
		this.turn = false;

	var bz = this.torus.clone();
	var x = this.ship.position.x;//+1*this.orientation.x;
	var y =0;
	var z = this.ship.position.z;//+1*this.orientation.z;

	var centro = bz.getCenter();
				
	this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z), this.boxOgetto.getSize());
	controls.boxTesta = bz;
		}
	};

};