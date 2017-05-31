/**
 * @author alteredq / http://alteredqualia.com/
 */
//import * as myModule from "/home/francesco/Documenti/magistrale/interactive_graphics/project/Common/MV.js";

THREE.Player = function (controls, planeWidth, planeHeight, playerN) {
	
	var scope = this;


	//SFERA RIFLETTENTE
		this.cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );


		//this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: controls.color, envMap: this.cubeCamera.renderTarget } );
		//var mirrorMaterial = new THREE.MeshPhongMaterial( { emissive: 0xffffff, envMap: cubeCamera.renderTarget } );


		//SFERA COLORATA	
		this.sphere = new THREE.SphereBufferGeometry( controls.dimension, 64, 64 );
		this.light = new THREE.PointLight( controls.color, 0.2, 5000,2 );

		this.light.add( new THREE.Mesh( this.sphere, new THREE.MeshToonMaterial( { 
				color: controls.color,
				specular:0xFFFFFF,
				reflectivity: 1 } ) ) );
		scene.add( this.light );

		this.light.position.y = 1;

		this.wallMaterial = new THREE.MeshBasicMaterial( {
							color: controls.color, 
							opacity: 0.8,
							transparent: true,
							specular:0xFFFFFF,
							reflectivity: 1 } 
						);

		//this.sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 500, 3 ), this.mirrorMaterial );
		this.turn = false;
		this.orientation = new vec3(1,0,0);
		//scene.add( this.cubeCamera );
		//scene.add( this.sphere );



		switch( playerN ) {
			case 0: // player 1
				this.light.position.x = planeWidth/3;
				this.light.position.z = 0;
				this.orientation = new vec3(-1,0,0);
				break;
			
			case 1: // player 2
				this.light.position.x = 0;
				this.light.position.z = planeWidth/3;
				this.orientation = new vec3(0,0,-1);
				break;
			
			case 2: // player 3
				this.light.position.x = -planeWidth/3;
				this.light.position.z = 0;
				this.orientation = new vec3(1,0,0);
				break;
			
			case 3: // player 4
				this.light.position.x = 0;
				this.light.position.z = -planeWidth/3;
				this.orientation = new vec3(0,0,1);
				break;
		}

		controls.boxWall.push(new THREE.Box2(
			new THREE.Vector2(
					this.light.position.x-controls.dimension,
					this.light.position.z-controls.dimension),
			new THREE.Vector2(
					this.light.position.x+controls.dimension,
					this.light.position.z+controls.dimension)));

		this.poseBK = this.light.position.clone();

		this.sphere.receiveShadow = true;

		this.theta = new vec3(1,0,0);
		this.orientation;
		this.ry = new mat3(0.0, 0.0, -1.0,
		    							0.0, 1.0, 0.0,
		    							1.0, 0.0,  0.0);

		this.ryt = new mat3(0.0, 0.0, 1.0,
		    							0.0, 1.0, 0.0,
		    							-1.0, 0.0,  0.0);

	/*this.cubeRender = function(renderer, scene) {
					// render cube map
				this.sphere.visible = false;
				this.cubeCamera.position.copy( this.light.position );
				this.cubeCamera.updateCubeMap( renderer, scene );
				this.sphere.visible = true;
			};
	*/

	this.stira = function(controls)
	{
		controls.alive=false;
		scene.remove(this.light);
		for (var i = 0; i < controls.walls.length; i++) 
			scene.remove(controls.walls[i]);
	}
	this.getPosition = function (){
		return this.light.position;
	}
	this.updatePlayerModel = function ( controls, scene, planeWidth, planeHeight ) {
		//GIRA A SINISTRA
		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation = math.multiply(this.orientation, this.ry) ;
			controls.leftClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;

		}

		//GIRA A DESTRA
		else if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation = math.multiply(this.orientation, this.ryt) ;
			controls.rightClicked++;
			this.poseBK = this.light.position.clone();
			this.turn = true;
		}

		//AVANZA NELLA DIREZIONE AGGIORNATA
		this.light.position.x=this.light.position.x+(this.orientation[0]*controls.velocity);
		this.light.position.z=this.light.position.z+(this.orientation[2]*controls.velocity);

		//SE IL GIOCATORE È USCITO, MUORE
		if (Math.abs(this.light.position.x)>planeWidth/2 || Math.abs(this.light.position.z)>planeHeight/2 )
		{
			this.stira(controls);
		}
		else
		{

			if ( this.turn ) 
			{
				//MI STO MUOVENDO LUNGO L'ASSE Z
				if(this.orientation[2]!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							1,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
					controls.boxWall.push(new THREE.Box2(
							new THREE.Vector2(this.poseBK.x-controls.wallThickness,this.poseBK.z),
							new THREE.Vector2(this.light.position.x+controls.wallThickness,this.light.position.z)
						));
				}
				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							1,
							controls.wallThickness
						);
					controls.boxWall.push(new THREE.Box2(
							new THREE.Vector2(this.poseBK.x,this.poseBK.z-controls.wallThickness),
							new THREE.Vector2(this.light.position.x,this.light.position.z+controls.wallThickness)
						));
				}
							

				var cube = new THREE.Mesh( geometry, this.wallMaterial);

				if(this.orientation[2]<0)//mi muovo sull'asse z
				{
					cube.position.x= this.poseBK.x;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z-Math.abs(this.light.position.z - this.poseBK.z)/2;
				}
				if(this.orientation[2]>0)//mi muovo sull'asse z
				{
					cube.position.x= this.poseBK.x;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z+Math.abs(this.light.position.z - this.poseBK.z)/2;
				}
				else if(this.orientation[0]<0)
				{
					cube.position.x= this.poseBK.x-Math.abs(this.light.position.x - this.poseBK.x)/2;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z;
				}
				else if (this.orientation[0]>0)
				{
					cube.position.x= this.poseBK.x+Math.abs(this.light.position.x - this.poseBK.x)/2;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z;
				}
				scene.add(cube);
				controls.walls.push(cube);

			}

			else
			{
				scene.remove(controls.walls.pop());
				if(controls.boxWall.length > 1)
					controls.boxWall.pop();

				//MI STO MUOVENDO LUNGO L'ASSE Z
				if(this.orientation[2]!=0)
				{
					var geometry = new THREE.BoxBufferGeometry(
							controls.wallThickness,
							1,
							Math.abs(this.light.position.z - this.poseBK.z)+controls.wallThickness
						);
						controls.boxWall.push(new THREE.Box2(
								new THREE.Vector2(this.poseBK.x-controls.wallThickness,this.poseBK.z),
								new THREE.Vector2(this.light.position.x+controls.wallThickness,this.light.position.z)
							));
				}

				//MI STO MUOVENDO LUNGO L'ASSE X
				else
				{
					var geometry = new THREE.BoxBufferGeometry(
							Math.abs(this.light.position.x - this.poseBK.x)+controls.wallThickness,
							1,
							controls.wallThickness
						);
			//		console.log("ciao");
					//console.log(controls.boxWall);
					controls.boxWall.push(new THREE.Box2(
						new THREE.Vector2(this.poseBK.x,this.poseBK.z-controls.wallThickness),
						new THREE.Vector2(this.light.position.x,this.light.position.z+controls.wallThickness)));
					//console.log(box.containsBox(box));
					//console.log(controls.boxWall);

				}

				//var geometry = new THREE.BoxBufferGeometry(controls.velocity,1,controls.velocity);

				var cube = new THREE.Mesh( geometry, this.wallMaterial);
				if(this.orientation[2]<0)//mi muovo sull'asse z
				{
					cube.position.x= this.poseBK.x;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z-Math.abs(this.light.position.z - this.poseBK.z)/2;
				}
				if(this.orientation[2]>0)//mi muovo sull'asse z
				{
					cube.position.x= this.poseBK.x;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z+Math.abs(this.light.position.z - this.poseBK.z)/2;
				}
				else if(this.orientation[0]<0)
				{
					cube.position.x= this.poseBK.x-Math.abs(this.light.position.x - this.poseBK.x)/2;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z;
				}
				else if (this.orientation[0]>0)
				{
					cube.position.x= this.poseBK.x+Math.abs(this.light.position.x - this.poseBK.x)/2;
					cube.position.y= this.poseBK.y;
					cube.position.z= this.poseBK.z;
				}
				scene.add(cube);
				controls.walls.push(cube);

			}

/*			if(controls.number==1)
			{
				console.log(this.orientation);
				console.log(this.light.position);
			}
*/

			this.turn = false;

		


			controls.boxWall[0] = new THREE.Box2(
			new THREE.Vector2(
					this.light.position.x-controls.dimension,
					this.light.position.z-controls.dimension),
			new THREE.Vector2(
					this.light.position.x+controls.dimension,
					this.light.position.z+controls.dimension));

		//	console.log(controls.boxWall);

					//controls.boxWall.push(new THREE.Box2(new THREE.Vector2(this.poseBK.x,this.poseBK.z),
					//											new THREE.Vector2(this.light.position.x,this.light.position.z)));
					

		}
	};

};
