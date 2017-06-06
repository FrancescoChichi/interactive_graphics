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
		this.sfera = new THREE.SphereBufferGeometry( controls.dimension, 64, 64 );
		this.light = new THREE.PointLight( controls.color, 5, 20,2 );

	var position = [0,controls.dimension,0];
	var rotation = [- Math.PI / 2, 0,0];

	var x = getShip();


	switch( playerN ) {
			case 0: // player 1
				position[0] = planeWidth/3;
				position[2] = 0;
				this.orientation = new THREE.Vector3(-1,0,0);
				x.rotateY(Math.PI);
				break;
			
			case 1: // player 2
				position[0] = 0;
				position[2] = planeWidth/3;
				this.orientation = new THREE.Vector3(0,0,-1);
			//	this.cube.rotateY(THREE.Math.degToRad( 90 ));
				x.rotateY(Math.PI/2);

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
				x.rotateY(-Math.PI/2);

			//	this.cube.rotateY(THREE.Math.degToRad( 90 ));

				break;
		}
		var scale = 0.25;
	x.position.x = position[0];
	x.position.y = position[1];
	x.position.z = position[2];
	x.scale.set(scale, scale, scale);
	scene.add(x);
	this.shipGeometry = new THREE.BufferGeometry();
	
	/*var material2 = new THREE.MeshToonMaterial( { 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 0.0 } );
	*/
	var textureLoader = new THREE.TextureLoader();

	var shipTexture = new textureLoader.load( "textures/metal-texture256.jpg" );
				//var texture = new THREE.TextureLoader().load( "textures/patterns/bright_squares256.png" );
				shipTexture.repeat.set( 1, 1 );
				shipTexture.wrapS = shipTexture.wrapT = THREE.RepeatWrapping;
				//shipTexture.magFilter = THREE.NearestFilter;
				shipTexture.format = THREE.RGBFormat;

				
				var shipMaterial = new THREE.MeshPhongMaterial( {
					shininess: 10,
					color: 0xffffff,
					specular: 0x999999,
					map: shipTexture
				} );


	this.group = new THREE.Group();

					var fanL = new THREE.Mesh();
					var fanR = new THREE.Mesh();
					var fanU = new THREE.Mesh();
					var fanD = new THREE.Mesh();
					var body = new THREE.Mesh();

				var offset = 0.3;
				var offsetY = 2.8;
				var offsetDist = 1.3;

				addOBJ('fan.obj',fanL, [position[0]-offsetDist, position[1]+offsetY, position[2]-offset], [0,- Math.PI / 2,- Math.PI / 2], [0.05,0.05,0.05], new THREE.MeshToonMaterial( { 
					color: controls.fanColor,
					specular:0xFFFFFF,
					reflectivity: 1 } ));

				addOBJ('fan.obj',fanR, [position[0]+offsetDist, position[1]+offsetY, position[2]+offset], [0, Math.PI / 2,- Math.PI / 2], [0.05,0.05,0.05], new THREE.MeshToonMaterial( { 
					color: controls.fanColor,
					specular:0xFFFFFF,
					reflectivity: 1 } ));
				 	fanR.geometry.computeBoundingBox();

					console.log(fanR.geometry.boundingBox.getSize());
				addOBJ('fan.obj',fanU, [position[0]+offset, position[1]+offsetY, position[2]-offsetDist], [0,Math.PI,- Math.PI / 2], [0.05,0.05,0.05], new THREE.MeshToonMaterial( { 
					color: controls.fanColor,
					specular:0xFFFFFF,
					reflectivity: 1 } ));

				addOBJ('fan.obj',fanD, [position[0]-offset, position[1]+offsetY, position[2]+offsetDist], [0,0,- Math.PI / 2], [0.05,0.05,0.05], new THREE.MeshToonMaterial( { 
					color: controls.fanColor,
					specular:0xFFFFFF,
					reflectivity: 1 } ));
				
				this.group.add( fanL );
				this.group.add( fanR );
				this.group.add( fanU );
				this.group.add( fanD );










	this.ship =new THREE.Mesh(this.shipGeometry, shipMaterial);

	var scale = [0.1,0.1,0.1];
		addOBJ('ship.obj',this.ship, position, rotation, scale, new THREE.MeshToonMaterial( { 
				color: 0x262626,
				specular:0xFFFFFF,
				reflectivity: 1 } ));


		this.group.add(this.ship);

				scene.add( this.group );


		this.sfera.computeBoundingBox();

		this.boxOgetto = this.sfera.boundingBox;

		this.light.add( new THREE.Mesh( this.sfera, new THREE.MeshToonMaterial( { 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } ) ) );

		scene.add( this.light );

		this.light.position.x = position[0];
		this.light.position.y = position[1];
		this.light.position.z = position[2];

		this.wallMaterial = new THREE.MeshBasicMaterial( {
							color: controls.color, 
							opacity: 0.8,
							transparent: true,
							reflectivity: 1 } 
						);

		//this.sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 500, 3 ), this.mirrorMaterial );
		this.turn = false;

		//DEBUG
		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});

		var size = this.boxOgetto.getSize();

		var geometry = new THREE.BoxBufferGeometry( size.x/2, size.y, size.z/2 );

		//geometry.translate(this.light.position.x,this.light.position.y,this.light.position.z);

		//this.cube = new THREE.Line( geometry, material );
		
		//FINE DEBUG

		//scene.add( this.cubeCamera );
		//scene.add( this.sphere );

		

		//this.cube.position.x = this.light.position.x+1*this.orientation.z;
		//this.cube.position.y =0;
		//this.cube.position.z = this.light.position.z+1*this.orientation.z;


		var x = this.light.position.x;//+1*this.orientation.x;
		var y =0;
		var z = this.light.position.z;//+1*this.orientation.z;
		
		this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z)
			, new THREE.Vector3(size.x/3,size.y,size.z/1.5));

		var bz = this.sfera.boundingBox;
		controls.boxTesta = bz;
		var centro = bz.getCenter();
		//this.cube.translate(centro.x,centro.y,centro.z);

		//scene.add( this.cube );

		
		this.poseBK = this.light.position.clone();

		//this.sphere.receiveShadow = true;

		this.theta = new vec3(1,0,0);

		this.ry = new THREE.Matrix3();
		this.ry.set(0.0, 0.0, -1.0,
					0.0, 1.0, 0.0,
					1.0, 0.0,  0.0);

		this.ryt =new THREE.Matrix3();
		this.ryt.set(0.0, 0.0, 1.0,
					0.0, 1.0, 0.0,
					-1.0, 0.0,  0.0);

	this.stira = function(controls)
	{
		controls.alive=false;
		scene.remove(this.light);
		//scene.remove(this.ship);
				scene.remove(this.group);

		for (var i = 0; i < controls.walls.length; i++) 
			scene.remove(controls.walls[i]);
	}

	this.getPosition = function (){
		return this.light.position;
	}

	this.updatePlayerModel = function ( controls, scene, planeWidth, planeHeight ) {
		//GIRA A SINISTRA
		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation.applyMatrix3(this.ry);
			controls.leftClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;

		}

		//GIRA A DESTRA
		else if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation.applyMatrix3(this.ryt);
			controls.rightClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;
		}

		//AVANZA NELLA DIREZIONE AGGIORNATA
		this.light.position.x=this.light.position.x+(this.orientation.x*controls.velocity);
		this.light.position.z=this.light.position.z+(this.orientation.z*controls.velocity);

		this.group.position.x=this.group.position.x+(this.orientation.x*controls.velocity);
		this.group.position.z=this.group.position.z+(this.orientation.z*controls.velocity);

		//SE IL GIOCATORE È USCITO, MUORE
		if (Math.abs(this.light.position.x)>planeWidth/2 || Math.abs(this.light.position.z)>planeHeight/2 )
		{
			this.stira(controls);
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
							1,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
				}
				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							1,
							controls.wallThickness
						);
				}	
				geometry.translate(com.x,1,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;

				controls.boxWall.push(bz);

				/*DEBUG
				var material = new THREE.LineBasicMaterial({
						color: 0x0000ff
							});
				var gem = new THREE.Geometry();
						gem.vertices.push(
				bz.min,
				bz.max);
			
				var linea = new THREE.Line(gem,material);
				scene.add(linea);
				*/

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
							1,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
				}	

				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							1,
							controls.wallThickness
						);
				}

				geometry.translate(com.x,1,com.z);
				geometry.computeBoundingBox();
				var bz = geometry.boundingBox;
				controls.boxWall.push(bz);

				/*DEBUG

				var material = new THREE.LineBasicMaterial({
					color: 0x0000ff
						});
				var gem = new THREE.Geometry();
						gem.vertices.push(
				bz.min,
				bz.max);
					
				var linea = new THREE.Line(gem,material);
				scene.add(linea);

				*/
				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				scene.add(cube);
				controls.walls.push(cube);

			}
		this.turn = false;

	var bz = this.sfera.boundingBox;
	var x = this.light.position.x;//+1*this.orientation.x;
	var y =0;
	var z = this.light.position.z;//+1*this.orientation.z;

	var centro = bz.getCenter();
	//this.cube.translate(centro.x,centro.y,centro.z);

	/*/this.cube.position.x = centro.x;//+1*this.orientation.x;
	this.cube.position.y =0;
	this.cube.position.z = centro.z;//+1*this.orientation.z;
*/
				/*DEBUG

	var material = new THREE.LineBasicMaterial({
	color: 0x0000ff
		});
	var geometry = new THREE.Geometry();
			geometry.vertices.push(
	this.sfera.boundingBox.min,this.sfera.boundingBox.max);
		

	var linea = new THREE.Line(geometry,material);
	//scene.add(linea);

		//console.log(controls.walls)
	*/

	//this.ship.position.x = this.light.position.x;
	//this.ship.position.z = this.light.position.z;


	this.boxOgetto = this.boxOgetto.setFromCenterAndSize( new THREE.Vector3(x,y,z), this.boxOgetto.getSize());
	controls.boxTesta = bz;
		}
	};

};