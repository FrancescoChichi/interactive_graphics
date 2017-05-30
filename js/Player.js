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
		this.sphere = new THREE.SphereBufferGeometry( 1, 64, 64 );
		this.light = new THREE.PointLight( controls.color, 0.2, 5000,2 );

		this.light.add( new THREE.Mesh( this.sphere, new THREE.MeshBasicMaterial( { color: controls.color } ) ) );
		scene.add( this.light );

		this.light.position.y = 1;


		//this.sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 500, 3 ), this.mirrorMaterial );

		this.orientation = new vec3(1,0,0);
		//scene.add( this.cubeCamera );
		//scene.add( this.sphere );
		this.wallPoses=[];




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
	this.getPosition = function (){
		return this.light.position;
	}
	this.updatePlayerModel = function ( controls, scene, planeWidth, planeHeight ) {

		// speed and wheels based on controls



		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation = math.multiply(this.orientation, this.ry) ;
			controls.leftClicked++;


		}

		if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation = math.multiply(this.orientation, this.ryt) ;
			controls.rightClicked++;

		}


			this.light.position.x=this.light.position.x+(this.orientation[0]*controls.velocity);
			this.light.position.z=this.light.position.z+(this.orientation[2]*controls.velocity);

			if (Math.abs(this.light.position.x)>planeWidth/2 || Math.abs(this.light.position.z)>planeHeight/2 )
			{
				controls.alive=false;
				scene.remove(this.light);
				for (var i = 0; i < controls.walls.length; i++) {
					scene.remove(controls.walls[i]);
				}
			}
			else
				{
				var geometry = new THREE.BoxBufferGeometry(controls.velocity,1,controls.velocity);
				var material = new THREE.MeshBasicMaterial( {color: controls.color, opacity: 100} );
				var cube = new THREE.Mesh( geometry, material);
				cube.position.x= this.poseBK.x;
				cube.position.y= this.poseBK.y;
				cube.position.z= this.poseBK.z;
				scene.add(cube);
				controls.walls.push(cube);
				this.poseBK = this.light.position.clone();
			}
	};

};
