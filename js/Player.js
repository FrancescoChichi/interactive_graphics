/**
 * @author alteredq / http://alteredqualia.com/
 */
//import * as myModule from "/home/francesco/Documenti/magistrale/interactive_graphics/project/Common/MV.js";

THREE.Player = function () {
	
	var scope = this;


	//SFERA RIFLETTENTE
		this.cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );


		this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: this.cubeCamera.renderTarget } );
		//var mirrorMaterial = new THREE.MeshPhongMaterial( { emissive: 0xffffff, envMap: cubeCamera.renderTarget } );

		this.sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 100, 3 ), this.mirrorMaterial );




		this.sphere.position.y = 100;
		this.sphere.receiveShadow = true;

		this.theta = new vec3(1,0,0);
		this.orientation;
		this.ry = new mat3(0.0, 0.0, -1.0,
		    							0.0, 1.0, 0.0,
		    							1.0, 0.0,  0.0);

		this.ryt = new mat3(0.0, 0.0, 1.0,
		    							0.0, 1.0, 0.0,
		    							-1.0, 0.0,  0.0);
		
		this.vel = 10;


	// API
		this.Player = function(scene){

		this.orientation = new vec3(1,0,0);
		scene.add( this.cubeCamera );
		scene.add( this.sphere );

	}

	this.cubeRender = function(renderer, scene) {
					// render cube map
				this.sphere.visible = false;
				this.cubeCamera.position.copy( this.sphere.position );
				this.cubeCamera.updateCubeMap( renderer, scene );
				this.sphere.visible = true;
			};
	
	this.updatePlayerModel = function ( controls ) {

		// speed and wheels based on controls



		if ( controls.leftClicked == 1 && controls.moveLeft ) {
			this.orientation = math.multiply(this.orientation, this.ry) ;
			controls.leftClicked++;
		}

		if ( controls.rightClicked == 1 && controls.moveRight ) {
			this.orientation = math.multiply(this.orientation, this.ryt) ;
			controls.rightClicked++;
		}


			this.sphere.position.x=this.sphere.position.x+(this.orientation[0]*this.vel);
			this.sphere.position.z=this.sphere.position.z+(this.orientation[2]*this.vel);


	};

};
