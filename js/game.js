
			if ( ! Detector.webgl ) {
				Detector.addGetWebGLMessage();
				document.getElementById( 'container' ).innerHTML = "";
			}
			var container, stats;
			var camera, controls, scene, renderer;
			var mesh, texture, geometry, material;
			var worldWidth = 128, worldDepth = 128;
			var cubeCamera;
			var walls = [];
			//var cubeMesh;
			//var sphereControls;
			//var sphere;
			//var loader;
			//var mesh2= new THREE.Mesh();

			var planeWidth = 100;
			var planeHeight = 100;

			var pause = false;

			var firstPlayerControls = {
				number: 1,
				dimension: 1,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0xff3399,
				alive: true,
				velocity: 0.1,
				boxWall: [],
				walls: [],
				wallThickness: 0.3
			};
			var secondPlayerControls = {
				number: 2,
				dimension: 1,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0x0bdd43,
				alive: true,
				velocity: 0.0,
				boxWall: [],
				walls: [],
				wallThickness: 1.0
			};

			var thirdPlayerControls = {
				number: 3,
				dimension: 1,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0x0033cc,
				alive: true,
				velocity: 0.4,
				boxWall: [],
				walls: [],
				wallThickness: 1.0
			};
			var fourthPlayerControls = {
				number: 4,
				dimension: 1,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0xfff316,
				alive: true,
				velocity: 0.4,
				boxWall: [],
				walls: [],
				wallThickness: 1.0
			};
			
			playersControl = [firstPlayerControls, secondPlayerControls, thirdPlayerControls, fourthPlayerControls];
			players = [];
			nPlayer = 2;

			var clock = new THREE.Clock();
			var gui, shadowCameraHelper, shadowConfig = {
				shadowCameraVisible: false,
				shadowCameraNear: 750,
				shadowCameraFar: 4000,
				shadowCameraFov: 30,
				shadowBias: -0.0002
			};

			var direction = 1; //0=left 1=front 2=right
			var tick=0;
			var click=0;
			/*var particleOptions = {
				position: new THREE.Vector3(),
				//positionRandomness: .3,
				velocity: new THREE.Vector3(),
				//velocityRandomness: .5,
				color: 0xff0040,
				//colorRandomness: .2,
				//turbulence: .5,
				//lifetime: 2,
				size: 50,
				//sizeRandomness: 1
			};
			var particleSpawnerOptions = {
				spawnRate: 1500000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
			};*/

			init();
			animate();
			function init() {
				container = document.getElementById( 'container' );

			//KEYBOARD CONTROLS
				var onKeyDown = function ( event ) {
					switch ( event.keyCode ) {
						case 81: // a
							firstPlayerControls.moveLeft = true;
							firstPlayerControls.leftClicked++;
							break;
						case 87: // d
							firstPlayerControls.moveRight = true;
							firstPlayerControls.rightClicked++;
							break;

						case 104: // a
							secondPlayerControls.moveLeft = true;
							secondPlayerControls.leftClicked++;
							break;
						case 105: // d
							secondPlayerControls.moveRight = true;
							secondPlayerControls.rightClicked++;
							break;
						
						case 67: // a
							thirdPlayerControls.moveLeft = true;
							thirdPlayerControls.leftClicked++;
							break;
						case 86: // d
							thirdPlayerControls.moveRight = true;
							thirdPlayerControls.rightClicked++;
							break;
													
						case 190: // a
							fourthPlayerControls.moveLeft = true;
							fourthPlayerControls.leftClicked++;
							break;
						case 173: // d
							fourthPlayerControls.moveRight = true;
							fourthPlayerControls.rightClicked++;
							break;
						case 27:
							pause = !pause;
							break;
					}
				};
				var onKeyUp = function ( event ) {
					switch( event.keyCode ) {
						case 81: // a
							firstPlayerControls.moveLeft = false;
							firstPlayerControls.leftClicked = 0;
							break;
						case 87: // d
							firstPlayerControls.moveRight = false;
							firstPlayerControls.rightClicked = 0;
							break;

						case 104: // a
							secondPlayerControls.moveLeft = false;
							secondPlayerControls.leftClicked = 0;
							break;
						case 105: // d
							secondPlayerControls.moveRight = false;
							secondPlayerControls.rightClicked = 0;
							break;
						
						case 67: // a
							thirdPlayerControls.moveLeft = false;
							thirdPlayerControls.leftClicked = 0;
							break;
						case 86: // d
							thirdPlayerControls.moveRight = false;
							thirdPlayerControls.rightClicked = 0;
							break;
													
						case 190: // a
							fourthPlayerControls.moveLeft = false;
							fourthPlayerControls.leftClicked = 0;
							break;
						case 173: // d
							fourthPlayerControls.moveRight = false;
							fourthPlayerControls.rightClicked = 0;
							break;
					}
				};




			//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				
				camera.position.x = 10;
				camera.position.y = 50;
				camera.position.z = 10;

				//camera.rotateY(  - Math.PI / 4 );
				//camera.lookAt( scene.position )camera.rotate.y = 90 * Math.PI / 180
				//camera.position.z = 100;




			
				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );


				renderer = new THREE.WebGLRenderer({antialias:true});
				//renderer.setClearColor( 0xaaccff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				//controls = new THREE.FirstPersonControls( camera );
				controls = new THREE.OrbitControls( camera, renderer.domElement );

				scene = new THREE.Scene();
		/*	//PARTICLE
				particleSystem = new THREE.GPUParticleSystem( {
					maxParticles: 250000
				} );
				scene.add( particleSystem );*/
	
				//scene.fog = new THREE.FogExp2( 0xaaccff, 0.007 );
				//scene.fog = new THREE.Fog( 0, 1000, 10000 );
				


	/*			var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );
				var ground = new THREE.Mesh( planeGeometry, groundMaterial );
				ground.position.set( 0, 0, 0 );
				ground.rotation.x = - Math.PI / 2;
				ground.scale.set( 1000, 1000, 1000 );
				ground.receiveShadow = true;
				scene.add( ground );*/


				groundGeometry = new THREE.PlaneBufferGeometry( planeWidth, planeHeight );
				groundGeometry.rotateX( - Math.PI / 2 );
				//geometry.rotateY( - Math.PI / 4 );

				var groundTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
				//var texture = new THREE.TextureLoader().load( "textures/patterns/bright_squares256.png" );
				groundTexture.repeat.set( 5, 5 );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.magFilter = THREE.NearestFilter;
				groundTexture.format = THREE.RGBFormat;

				// GROUND
				var groundMaterial = new THREE.MeshPhongMaterial( {
					shininess: 80,
					color: 0xffffff,
					specular: 0xffffff,
					map: groundTexture
				} );

				material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: groundTexture } ); 
				ground = new THREE.Mesh( groundGeometry, groundMaterial );
				//ground.scale.set( 1000, 1000, 1000 );

				ground.receiveShadow = true;

				scene.add( ground );




		   // LIGHTS
		    scene.add(new THREE.AmbientLight(0xffffff,2));

		  /*  var light;

		    light = new THREE.DirectionalLight(0xdfebff, 1.75);
		    light.position.set(300, 400, 50);
		    light.position.multiplyScalar(1.3);

		    light.castShadow = true;
		    light.shadowCameraVisible = true;

		    light.shadowMapWidth = 512;
		    light.shadowMapHeight = 512;

		    var d = 200;

		    light.shadowCameraLeft = -d;
		    light.shadowCameraRight = d;
		    light.shadowCameraTop = d;
		    light.shadowCameraBottom = -d;

		    light.shadowCameraFar = 1000;
		    light.shadowDarkness = 0.2;

		    scene.add(light);*/

				/*var spotLight = new THREE.SpotLight( 0xffffff );
				spotLight.position.set( 100, 1000, 100 );

				spotLight.castShadow = true;

				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;

				spotLight.shadow.camera.near = 500;
				spotLight.shadow.camera.far = 4000;
				spotLight.shadow.camera.fov = 30;

				scene.add( spotLight );
*/






		/*	//SFERA COLORATA	
				var littleSphere = new THREE.SphereGeometry( 10, 64, 64 );
				light1 = new THREE.PointLight( 0xff0040, 2, 5000 );
				light1.position.x = 100;
				light1.position.y = 100;
				light1.position.z = 100;
				light1.add( new THREE.Mesh( littleSphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
				scene.add( light1 );
*/

			//SFERA RIFLETTENTE


/*				cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );

				var mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeCamera.renderTarget } );
				//var mirrorMaterial = new THREE.MeshPhongMaterial( { emissive: 0xffffff, envMap: cubeCamera.renderTarget } );
				//scene.add(cubeCamera);

				sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 10, 3 ), mirrorMaterial );

				sphere.position.y=10;
				sphere.receiveShadow = true;
				sphere.add(cubeCamera);
				scene.add( sphere );
		*/
				for (var i = 0; i < nPlayer; i++)
					players[i] = new THREE.Player( playersControl[i],planeWidth, planeHeight, i);
				
				
				//sphereControls = new THREE.DeviceOrientationControls(sphere);



		//		cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );
	/*			var mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeCamera.renderTarget } );

SWTOR_Spy.stl
				loader = new THREE.STLLoader();
				loader.load( 'stl/hilbertCube/Hilbert3.stl', function ( geometry ) {
					
					var cubeMesh = new THREE.Mesh( geometry, mirrorMaterial );
					cubeMesh.position.set( 0, 5, 0);
					cubeMesh.rotation.set( - Math.PI / 2, 0, 0 );
					cubeMesh.scale.set( 0.25, 0.25, 0.25 );
					cubeMesh.castShadow = true;
					cubeMesh.receiveShadow = true;
					cubeMesh.add(cubeCamera);

					scene.add( cubeMesh );
				}  );

*/



			/*	var cubeTexture = new THREE.TextureLoader().load( "textures/mozzarellona.jpeg" );
				//var texture = new THREE.TextureLoader().load( "textures/patterns/bright_squares256.png" );
				groundTexture.repeat.set( 5, 5 );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.magFilter = THREE.NearestFilter;
				groundTexture.format = THREE.RGBFormat;

				// GROUND
				var groundMaterial = new THREE.MeshPhongMaterial( {
					shininess: 80,
					color: 0xffffff,
					specular: 0xffffff,
					map: groundTexture
				} );

				material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: groundTexture } ); 
				ground = new THREE.Mesh( groundGeometry, groundMaterial );
				//ground.scale.set( 1000, 1000, 1000 );

				ground.receiveShadow = true;

				scene.add( ground );*/


			/*	light1 = new THREE.PointLight( 0xff0040, 2, 5000 );
				//console.log(cubeCamera.position);
				light1.position.x = 0;
				light1.position.y = 10;
				light1.position.z = 0;
				scene.add( light1 );*/
			/*	var loader2 = new THREE.OBJLoader(  );

					loader.load( 'stl/LIGHT_BIKE_03.obj', function ( geometry ) {
					mesh = new THREE.Mesh( geometry, mirrorMaterial2 );
					mesh.position.set( 100, 0, 100);
					mesh.rotation.set( - Math.PI / 2, 0, 0 );
					mesh.scale.set( 0.1,0.1,0.1 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					scene.add( mesh );
				} );*/
				/*
				pointLight = new THREE.PointLight( 0xff0000, 10, 5000 );
				pointLight.position.set( sphere.position.x, 100, sphere.position.z );
				scene.add( pointLight );*/


			
				//******renderer******
				container.innerHTML = "";
				container.appendChild( renderer.domElement );
				stats = new Stats();
				container.appendChild( stats.dom );
				//
				window.addEventListener( 'resize', onWindowResize, false );


/*
				gui = new dat.GUI( { width: 400 } );
				// SHADOW
				var shadowGUI = gui.addFolder( "Shadow" );
    		shadowGUI.add( shadowConfig, 'shadowCameraVisible' ).onChange( function() {
					shadowCameraHelper.visible = shadowConfig.shadowCameraVisible;
				});
				shadowGUI.add( shadowConfig, 'shadowCameraNear', 1, 1500 ).onChange( function() {
					sunLight.shadow.camera.near = shadowConfig.shadowCameraNear;
					sunLight.shadow.camera.updateProjectionMatrix();
					shadowCameraHelper.update();
				});
				shadowGUI.add( shadowConfig, 'shadowCameraFar', 1501, 5000 ).onChange( function() {
					sunLight.shadow.camera.far = shadowConfig.shadowCameraFar;
					sunLight.shadow.camera.updateProjectionMatrix();
					shadowCameraHelper.update();
				});
				shadowGUI.add( shadowConfig, 'shadowCameraFov', 1, 120 ).onChange( function() {
					sunLight.shadow.camera.fov = shadowConfig.shadowCameraFov;
					sunLight.shadow.camera.updateProjectionMatrix();
					shadowCameraHelper.update();
				});
				shadowGUI.add( shadowConfig, 'shadowBias', -0.01, 0.01 ).onChange( function() {
					sunLight.shadow.bias = shadowConfig.shadowBias;
				});
				shadowGUI.open();*/

			}

				
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			
			function animate() {
				requestAnimationFrame( animate );

				if (!pause)
				{

					for (var i = 0; i < nPlayer; i++){
						if(playersControl[i].boxWall.length==1)
							playersControl[i].boxWall.push(new THREE.Box2(new THREE.Vector2(-10,-10),
															new THREE.Vector2(10,10)));
						for (var j = 1; j < playersControl[i].boxWall.length; j++){
							if (playersControl[i].boxWall[j].intersectsBox(playersControl[i].boxWall[0])){
								console.log("player "+playersControl[0].number+" collide ");
								playersControl[i].velocity = 0.0;

						}
							}
					}

					for (var i = 0; i < nPlayer; i++)
					{
						if (playersControl[i].alive)
							players[i].updatePlayerModel(playersControl[i], scene, planeWidth, planeHeight);
						else
						{
							nPlayer--;
							players.splice(i,1);
							playersControl.splice(i,1);
						}
					}
					if(nPlayer == 1){
						console.log("player "+playersControl[0].number+" win ");
						playersControl[0].velocity = 0.0;
						/*camera.position.set(players[0].getPosition().x+20,players[0].getPosition().y,players[0].getPosition().z+20);
						camera.up = new THREE.Vector3(0,0,1);
						camera.lookAt(new THREE.Vector3(players[0].getPosition().x,players[0].getPosition().y,players[0].getPosition().z));*/

/*
						camera.position.x = players[0].getPosition().x;
						camera.position.y = players[0].getPosition().y +10;
						camera.position.z = players[0].getPosition().z;*/
						//camera.lookAt(players[0].getPosition().x,players[0].getPosition().y,players[0].getPosition().z);

						nPlayer--;
					}

					render();
					stats.update();
				}
			}
			function render() {

				var delta = clock.getDelta();
				controls.update( delta );


				//cubeMesh.visible = false;
				//cubeCamera.updateCubeMap( renderer, scene );
				//cubeMesh.visible = true;


			// render scene
				renderer.render( scene, camera );
			}