THREE.Player = function (controls, planeWidth, planeHeight, playerN) {
	
	var scope = this;
	
	this.deathAnimationFrameCounter = 0;
	this.wallHeight = 2.5;
	this.wallY = 1.2;
	this.deathAnimationFrame = 100;
	this.shipScale ;

	var position = new THREE.Vector3(0,controls.dimension,0);
	var rotation = [- Math.PI / 2, 0,0];
	var explosionParticleNumber = 50;

	var textureLoader = new THREE.TextureLoader();

	var shipTexture = new textureLoader.load( "textures/metal-texture256.jpg" );
		shipTexture.repeat.set( 1, 1 );
		shipTexture.wrapS = shipTexture.wrapT = THREE.RepeatWrapping;
		shipTexture.format = THREE.RGBFormat;

	var shipMaterial = new THREE.MeshPhongMaterial( {
		shininess: 10,
		color: 0xffffff,
		specular: 0x999999,
		map: shipTexture
	} );

	this.player = new THREE.Ship(controls,0.18);
	this.ship = this.player.getAll();
	this.shipScale = this.ship.scale;

	switch( playerN ) {
			case 0: // player 1
				position.x = planeWidth/3;
				position.z = 0;
				this.orientation = new THREE.Vector3(-1,0,0);
				this.ship.rotateY(Math.PI);
				break;
			
			case 1: // player 2
				position.x = 0;
				position.z = planeWidth/3;
				this.orientation = new THREE.Vector3(0,0,-1);
				this.ship.rotateY(Math.PI/2);

				break;
				
			case 2: // player 3
				position.x = -planeWidth/3;
				position.z = 0;
				this.orientation = new THREE.Vector3(1,0,0);

				break;
			
			case 3: // player 4
				position.x = 0;
				position.z = -planeWidth/3;
				this.orientation = new THREE.Vector3(0,0,1);
				this.ship.rotateY(-Math.PI/2);


				break;
		}
		
		var scale = 0.25;
		this.ship.position.copy(position);
		//this.ship.scale.set(scale, scale, scale);
		gameScene.add(this.ship);
		this.ship.updateMatrixWorld();

		this.torus = new THREE.Box3().setFromObject(this.player.getCabin());

		this.wallMaterial = new THREE.MeshBasicMaterial( {
							color: controls.color, 
							opacity: 0.8,
							transparent: true,
							reflectivity: 1 } 
						);

		this.turn = false;
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
		//this.ship.visible = false;
		//gameScene.remove(this.ship);
		//this.ship.scale.copy(new THREE.Vector3(0.0001,0.0001,0.0001));

		for (var i = 0; i < controls.walls.length; i++) 
			gameScene.remove(controls.walls[i]);

	}

	this.render = function(time, controls, sound){

		if(this.player.render(controls,2,sound))
		{
			this.death(controls);
			return true;
		}
		else
		{
			return false;
		}

	}

	this.getPosition = function (){
		return this.ship.position;
	}
	this.getOrientation = function(){
		return this.orientation;
	}
	this.updatePlayerModel = function ( controls, gameScene, planeWidth, planeHeight, sound ) {
		//GIRA A SINISTRA
		//cabin.position.y = 0;
		this.torus = new THREE.Box3().setFromObject(this.player.getCabin());

		if ( !controls.pushed  && controls.moveLeft ) {
			this.orientation.applyMatrix3(this.ryt);
			controls.pushed = true;
			this.poseBK = this.ship.position.clone();
			this.turn = true;
			this.ship.rotateY(+Math.PI/2);
		}

		//GIRA A DESTRA
		else if ( !controls.pushed  && controls.moveRight ) {
			this.orientation.applyMatrix3(this.ry);
			controls.pushed = true;
			this.poseBK = this.ship.position.clone();
			this.turn = true;
			this.ship.rotateY(-Math.PI/2);
		}

		//AVANZA NELLA DIREZIONE AGGIORNATA

		this.ship.position.x=this.ship.position.x+(this.orientation.x*controls.velocity);
		this.ship.position.z=this.ship.position.z+(this.orientation.z*controls.velocity);

		this.ship.getObjectByName("torus").rotateZ(THREE.Math.degToRad(-1.5));

		//SE IL GIOCATORE È USCITO, MUORE
		if(controls.alive)
		{
			var geometry = 0;

			if (! this.turn ) 
			{
				gameScene.remove(controls.walls.pop());
				controls.boxWall.pop();

			}
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
				controls.walls.push(cube);
				gameScene.add(cube);

				this.turn = false;
				controls.boxTesta = this.torus.clone();
		}
	};

};