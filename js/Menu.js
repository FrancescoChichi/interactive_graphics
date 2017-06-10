
			if ( ! Detector.webgl ) {
				Detector.addGetWebGLMessage();
				document.getElementById( 'container2' ).innerHTML = "";
			}
			var container, stats;
			var camera, controls, scene, renderer;
			var mesh, texture, geometry, material;
			var worldWidth = 128, worldDepth = 128;
			var cubeCamera;
			var walls = [];

			var planeWidth = 100;
			var planeHeight = 100;
			var time = Math.random();

			var clock = new THREE.Clock();
			var gui, shadowCameraHelper, shadowConfig = {
				shadowCameraVisible: false,
				shadowCameraNear: 750,
				shadowCameraFar: 4000,
				shadowCameraFov: 30,
				shadowBias: -0.0002
			};
			var plControls;

//this.renderMenu = function(playerControls){
	init();
	animate();
//}
this.cleanMenu = function(){
	scene = null;
	container = null;
	camera = null;
	controls =null;
	 renderer=null;

}

			function init() {				

				container = document.getElementById( 'container2' );
 						console.log("check");
			sound = new Sound();						

			//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				
				camera.position.set(0.0,90.0,0.0);


				renderer = new THREE.WebGLRenderer({antialias:true});
				//renderer.setClearColor( 0xaaccff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				//controls = new THREE.FirstPersonControls( camera );
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = 1.5;
				controls.minDistance= 0;
				controls.maxDistance= worldWidth *1.5;
				scene = new THREE.Scene();

				groundGeometry = new THREE.PlaneBufferGeometry( planeWidth, planeHeight );
				groundGeometry.rotateX( - Math.PI / 2 );
				//geometry.rotateY( - Math.PI / 4 );

				var groundTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
				//var texture = new THREE.TextureLoader().load( "textures/patterns/bright_squares256.png" );
				groundTexture.repeat.set( 10, 10 );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.magFilter = THREE.NearestFilter;
				groundTexture.format = THREE.RGBFormat;

				// GROUND
				var groundMaterial = new THREE.MeshPhongMaterial( {
					shininess: 0,
					color: 0xffffff,
					side: THREE.DoubleSide,
					map: groundTexture
				} );

				material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: groundTexture } ); 
				ground = new THREE.Mesh( groundGeometry, groundMaterial );
				//ground.scale.set( 1000, 1000, 1000 );

				ground.receiveShadow = true;

				scene.add( ground );
				//sound.menu_sound.play();
				//document.getElementById("mainPage").setAttribute("style","display:none");

			/*	player = new THREE.Ship(playerControls);
				ship = player.getAll();
				scene.add(ship);*/

				//******renderer******
				container.innerHTML = "";
				container.appendChild( renderer.domElement );
				stats = new Stats();
				container.appendChild( stats.dom );
				//
				window.addEventListener( 'resize', onWindowResize, false );
				
			}

				
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			
			function animate()
			{
				//camera = camera.rotateX(THREE.Math.degToRad( 100 ));
				requestAnimationFrame( animate );

				render();
				stats.update();
					
			}
			function render() {

				var delta = clock.getDelta();
				controls.update( delta );

				renderer.render( scene, camera );
			}

	function Sound() {

		this.death_sound  = new Audio("audio/explode.mp3");
		this.paddle_sound = new Audio("audio/laser.mp3");
		this.brick_sound  = new Audio("audio/beep.mp3");
		this.brick_sound2 = new Audio("audio/laser.mp3");
		this.level_sound = new Audio("audio/powerup.mp3");
		this.menu_sound = new Audio("audio/menu.mp3");
		this.menu_sound.loop=true;

	};

