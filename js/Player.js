/**
 * @author alteredq / http://alteredqualia.com/
 */
//import * as myModule from "/home/francesco/Documenti/magistrale/interactive_graphics/project/Common/MV.js";

THREE.Player = function (controls, planeWidth, planeHeight, playerN) {
	
	var scope = this;



	//SFERA RIFLETTENTE
		//this.cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );

		//this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: controls.color, envMap: this.cubeCamera.renderTarget } );
		//var mirrorMaterial = new THREE.MeshPhongMaterial( { emissive: 0xffffff, envMap: cubeCamera.renderTarget } );

		//SFERA COLORATA	
	this.wallHeight = 3;
	var position = [0,controls.dimension,0];
	var rotation = [- Math.PI / 2, 0,0];


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
		scene.add(this.ship);
		this.ship.updateMatrixWorld();


		this.light = new THREE.PointLight( controls.color, 5, 20,2 );
		this.light.add( new THREE.Mesh( this.torus, new THREE.MeshToonMaterial( { 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } ) ) );


		this.light.position.x = position[0];
		this.light.position.y = position[1];
		this.light.position.z = position[2];


		this.torus = new THREE.Box3().setFromObject(this.player.getCabin()	);


		this.boxOgetto = this.torus.clone();



		this.wallMaterial = new THREE.MeshBasicMaterial( {
							color: controls.color, 
							opacity: 0.8,
							transparent: true,
							reflectivity: 1 } 
						);

		this.turn = false;


		var size = this.boxOgetto.getSize();

		var geometry = new THREE.BoxBufferGeometry( size.x/2, size.y, size.z/2 );

		var x = this.light.position.x;//+1*this.orientation.x;
		var y =0;
		var z = this.light.position.z;//+1*this.orientation.z;
		
		this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z)
			, new THREE.Vector3(size.x/3,size.y,size.z/1.5));

		var bz = this.torus.clone();
		controls.boxTesta = bz;
		var centro = bz.getCenter();

		this.poseBK = this.light.position.clone();


		this.ry = new THREE.Matrix3();
		this.ry.set(0.0, 0.0, -1.0,
					0.0, 1.0, 0.0,
					1.0, 0.0,  0.0);

		this.ryt =new THREE.Matrix3();
		this.ryt.set(0.0, 0.0, 1.0,
					0.0, 1.0, 0.0,
					-1.0, 0.0,  0.0);

	this.death = function(controls, sound)
	{
		controls.alive=false;

		scene.remove(this.ship);

		sound.death_sound.play();

		for (var i = 0; i < controls.walls.length; i++) 
			scene.remove(controls.walls[i]);
	}

	this.render = function(renderer, scene, time){
		this.ship.position.y = Math.sin( time*5 ) + 1 ;
		//this.player.render(renderer, scene, time); 
	}

	this.getPosition = function (){
		return this.light.position;
	}

	this.updatePlayerModel = function ( controls, scene, planeWidth, planeHeight, sound ) {
		//GIRA A SINISTRA
		this.torus = new THREE.Box3().setFromObject(this.player.getCabin());

		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation.applyMatrix3(this.ry);
			controls.leftClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;
			this.ship.rotateY(-Math.PI/2);
		}

		//GIRA A DESTRA
		else if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation.applyMatrix3(this.ryt);
			controls.rightClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;
			this.ship.rotateY(+Math.PI/2);
		}

		//AVANZA NELLA DIREZIONE AGGIORNATA
		this.light.position.x=this.light.position.x+(this.orientation.x*controls.velocity);
		this.light.position.z=this.light.position.z+(this.orientation.z*controls.velocity);

		this.ship.position.x=this.ship.position.x+(this.orientation.x*controls.velocity);
		this.ship.position.z=this.ship.position.z+(this.orientation.z*controls.velocity);

		this.player.updateParticle();

		this.ship.getObjectByName("torus").rotateZ(THREE.Math.degToRad(-5));

		//SE IL GIOCATORE È USCITO, MUORE
		if (Math.abs(this.light.position.x)>planeWidth/2 || Math.abs(this.light.position.z)>planeHeight/2 )
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
				com.addVectors (this.light.position,this.poseBK);
				com.divideScalar(2); 

				if(this.orientation.z!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							this.wallHeight,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
				}
				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							this.wallHeight,
							controls.wallThickness
						);
				}	
				geometry.translate(com.x,1,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;

				controls.boxWall.push(bz);

				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				scene.add(cube);
				controls.walls.push(cube);

			}

			else
			{
				scene.remove(controls.walls.pop());
				controls.boxWall.pop();

				var  com = new THREE.Vector3() ;
				com.addVectors (this.light.position,this.poseBK);
				com.divideScalar(2); 
				if(this.orientation.z!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							this.wallHeight,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
				}	

				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							this.wallHeight,
							controls.wallThickness
						);
				}

				geometry.translate(com.x,1,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;
				controls.boxWall.push(bz);

				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				scene.add(cube);
				controls.walls.push(cube);

			}
		this.turn = false;

	var bz = this.torus.clone();
	var x = this.light.position.x;//+1*this.orientation.x;
	var y =0;
	var z = this.light.position.z;//+1*this.orientation.z;

	var centro = bz.getCenter();
				
	this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z), this.boxOgetto.getSize());
	controls.boxTesta = bz;
		}
	};

};