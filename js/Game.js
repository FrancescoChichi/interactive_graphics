
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


			/*=====================*\
			 * START CONFIGURATION *
			\*=====================*/

			var lightModality = "";
			var planeWidth = 100;
			var planeHeight = 100;
			var time = Math.random();
			var pause = false;
			var velocity = 0.2;
			var dimension = 0.5;
			var wallThick = 0.8;
			var startGame = false;
			var music = false;
			var hemiLight;
			var halo;

			var firstPlayerControls = {
				number: 1,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				pushed: false,
				color: 0xff3399,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: new  THREE.Box3(),
			};
			var secondPlayerControls = {
				number: 2,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				pushed: false,
				color: 0x0bdd43,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: new  THREE.Box3(),
			};

			var thirdPlayerControls = {
				number: 3,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				pushed: false,
				color: 0xff9900,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: new  THREE.Box3(),
			};
			var fourthPlayerControls = {
				number: 4,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				pushed: false,
				color: 0xff0000,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: new  THREE.Box3(),
			};
			
			var lightPower = 10; //power up intensity 

			playersControl = [firstPlayerControls, secondPlayerControls, thirdPlayerControls, fourthPlayerControls];
			players = [];
			nPlayer = 4;
			alive = nPlayer;

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

			var cameraPose = new THREE.Vector3(0.0,90.0,0.0);
			var cameraPoseBK = new THREE.Vector3(0.0,90.0,0.0);
			var follow = false;
			var playerToFollow = -1;
			/*===================*\
			 * END CONFIGURATION *
			\*===================*/


			init();
			animate();

			function init() {
				container = document.getElementById( 'container' );
 						
 			/*sound = new Sound();
			sound.menu_sound.play();*/

			//KEYBOARD CONTROLS
				var onKeyDown = function ( event ) {
					switch ( event.keyCode ) {
						case 87: // q
							firstPlayerControls.moveLeft = true;
							break;
						case 81: // w
							firstPlayerControls.moveRight = true;
							break;

						case 105: // a
							secondPlayerControls.moveLeft = true;
							break;
						case 104: // d
							secondPlayerControls.moveRight = true;
							break;
						
						case 86: // a
							thirdPlayerControls.moveLeft = true;
							break;
						case 67: // d
							thirdPlayerControls.moveRight = true;
							break;
													
						case 188: // a
							fourthPlayerControls.moveLeft = true;
							break;
						case 190: // d
							fourthPlayerControls.moveRight = true;
							break;
						case 27: // ESC
							pause = !pause;
							break;
						case 49:
							follow = false;
							cameraPose.set(0.0,90.0,0.0);
							break;
						case 50:
							follow = false;
							cameraPose.set(-61.5,16.0,-63.7);
							break;
						case 51:
							follow = false;
							cameraPose.set(-61.5,16.0,63.7);
							break;
						case 52:
							follow = false;
							cameraPose.set(61.5,16.0,63.7);
							break;
						case 53:
							follow = false;
							cameraPose.set(61.5,16.0,-63.7);
							break;
						case 54:
						if(nPlayer == 1){
							follow = true;
							cameraPose.set(players[0].getPosition().x,players[0].getPosition().y,players[0].getPosition().z);
							playerToFollow = 0;
						}
							break;
					}
				};
				var onKeyUp = function ( event ) {
					switch( event.keyCode ) {
						case 87: // w
							firstPlayerControls.moveLeft = false;
							firstPlayerControls.pushed = false;
							break;
						case 81: // q
							firstPlayerControls.moveRight = false;
							firstPlayerControls.pushed = false;
							break;

						case 105: // numpad 8
							secondPlayerControls.moveLeft = false;
							secondPlayerControls.pushed = false;
							break;
						case 104: // numpad 9
							secondPlayerControls.moveRight = false;
							secondPlayerControls.pushed = false;
							break;
						
						case 86: // c
							thirdPlayerControls.moveLeft = false;
							thirdPlayerControls.pushed = false;
							break;
						case 67: // v
							thirdPlayerControls.moveRight = false;
							thirdPlayerControls.pushed = false;
							break;
													
						case 188: // period
							fourthPlayerControls.moveLeft = false;
							fourthPlayerControls.pushed = false;
							break;
						case 190: // comma
							fourthPlayerControls.moveRight = false;
							fourthPlayerControls.pushed = false;
							break;
					}
				};




			//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				
				camera.position.set(0.0,90.0,0.0);

	
				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );


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


				/*

			//SKYBOX
	
			var prefix = "textures/skybox/";
			var suffix = ".PNG";
			var urls  = [prefix+"nz"+'.JPG', 
						 prefix+"ny"+suffix, 
						 prefix+"nz"+'.JPG', 
						 prefix+"py"+'.JPG', 
						 prefix+"px"+'.JPG', 
						 prefix+"prova"+'.JPG'];
			
			var reflectionCube = new THREE.CubeTextureLoader().load( urls );
			reflectionCube.format = THREE.RGBFormat;

			scene.background = reflectionCube;

				*/


				//MAP WALLS
				scene.add(new THREE.Mesh(
					new THREE.BoxBufferGeometry(
							-worldWidth*4/5,
							0.01,
							worldWidth*4/5), 
					new THREE.MeshBasicMaterial( {
							color: 0xff3300, 
							opacity: 0.5,
							transparent: true })
					));


				halo = new THREE.Halo(worldWidth/2);

				scene.add(halo.getTorus());


				//POWER UP
				var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );


				light1 = new THREE.PointLight( 0xff0000, 2, lightPower );
				light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
				scene.add( light1 );
				
				light2 = new THREE.PointLight( 0x0040ff, 2, lightPower );
				light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
				scene.add( light2 );


				light3 = new THREE.PointLight( 0x80ff80, 2, lightPower );
				light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
				scene.add( light3 );

				light4 = new THREE.PointLight( 0xffaa00, 2, lightPower );
				light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
				scene.add( light4 );

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


				if(startGame)	
				{
					if (!pause)
					{
						collision();
						checkEnd();
					}
				}
				else
 				{
 					//document.body.background = "images/background.jpg";
 					document.getElementById("start").onclick = function(){

						nPlayer = document.getElementById("dropdown").options[document.getElementById("dropdown").selectedIndex].value;
						lightModality = document.getElementById("dayMode").options[document.getElementById("dayMode").selectedIndex].value;

						if(lightModality ==  "night")
							halo.rotateHalo(Math.PI);

						sound = new Sound();

						if(music)
						{
							sound.menu_sound.play();
						}


 						startGame = true; 
 						alive = nPlayer;
 						for (var i = 0; i < alive; i++)
							players[i] = new THREE.Player( playersControl[i],planeWidth, planeHeight, i);

						closeMenu();
 					};
 					document.getElementById("music").onclick = function(){
 						if(music)
 						{
 							document.getElementById("music").innerHTML = "OFF";
    					document.getElementById("music").style.color = 'red';
 						}
 						else
 						{
 							document.getElementById("music").innerHTML = "ON";
    					document.getElementById("music").style.color = 'green';
 						}
 						music = !music;
					};
							
 				}
 				if(startGame)
 				{
					render();
					stats.update();
				}	
			}
			function render() {

				var delta = clock.getDelta();
				controls.update( delta );

				var dist = 30;
				var scale = 0.9;
				var vel = 25;
				var boh = 100;
				if(!pause)
				{		
					time += 0.001;			

					light1.position.x = Math.sin( time * vel * 0.7 ) * boh;
					light1.position.y = 1;
					light1.position.z = Math.cos( time * vel * 0.3 ) * boh;
					light2.position.x = Math.cos( time * vel * 0.3 ) * boh;
					light2.position.y = 1;
					light2.position.z = Math.sin( time * vel * 0.7 ) * boh;
					light3.position.x = Math.sin( time * vel * 0.7 ) * boh;
					light3.position.y = 1;
					light3.position.z = Math.sin( time * vel * 0.5 ) * boh;
					light4.position.x = Math.sin( time * vel * 0.3 ) * boh;
					light4.position.y = 1;
					light4.position.z = Math.sin( time * vel * 0.5 ) * boh;

					if(lightModality == "cycle")
						halo.animate();
					for (var i = 0; i < alive; i++)
					{

						if(players[i].render( time, playersControl[i], sound.death_sound ))
						{
							players.splice(i,1);
							playersControl.splice(i,1);
							alive--;
						}
					}
				}

				if(cameraPose.x!=cameraPoseBK.x||cameraPose.y!=cameraPoseBK.y||cameraPose.z!=cameraPoseBK.z){
					camera.position.set(cameraPose.x,cameraPose.y,cameraPose.z);
					cameraPoseBK.set(cameraPose.x,cameraPose.y,cameraPose.z);
				}
				if (follow && nPlayer == 1){
					var x = new THREE.Vector3(players[playerToFollow].getOrientation().x * 10,players[playerToFollow].getOrientation().y * 10,players[playerToFollow].getOrientation().z * 10);
					var y = new THREE.Vector3(players[playerToFollow].getOrientation().x * 5,
						players[playerToFollow].getOrientation().y * 5,
						players[playerToFollow].getOrientation().z * 5);

					camera.position.set(players[playerToFollow].getPosition().x-y.x,players[playerToFollow].getPosition().y+5,players[playerToFollow].getPosition().z-y.z);
					controls.target.set(players[playerToFollow].getPosition().x+x.x,players[playerToFollow].getPosition().y,players[playerToFollow].getPosition().z+x.z);
				}

			// render scene
				renderer.render( scene, camera );
			}

			function collision()
			{
				for (var i = 0; i < alive; i++){
										if (Math.abs(this.players[i].getPosition().x)>planeWidth/2 || 
											Math.abs(this.players[i].getPosition().z)>planeHeight/2 )
										{
												playersControl[i].alive = false;
										}

										var playerBox = playersControl[i].boxTesta;

										for (var o = 0; o < alive; o++)
										{	
											var j = 0;

											lunghezza = playersControl[o].boxWall.length

											if (i==o)
											{
												lunghezza -= 2;
											}
											else
											{
												if (!playersControl[i].alive)
													continue;
												if (playersControl[o].alive)
												{
													if (playerBox.intersectsBox(playersControl[o].boxTesta)) 
															{
																console.log("player "+playersControl[i].number+" collide con player"+playersControl[o].number);
																playersControl[i].alive = false;
																playersControl[o].alive= false;
																lunghezza = 0;
															}
												}
												else
													continue;
											}
										
											for (; j<lunghezza; j++)
												{		
													if (!playersControl[o].alive)
														continue;
													if (playerBox.intersectsBox(playersControl[o].boxWall[j]))
													{	
														console.log('player '+playersControl[i].number+' collide con muro di '+playersControl[o].number)
														playersControl[i].alive = false;
													}
												}
											}
										}
									
			}

			function checkEnd()
			{
				var c = 0;
				var indexPlayer = 0;
				for (var i = 0; i < alive; i++)
				{
					if (playersControl[i].alive){
						players[i].updatePlayerModel(playersControl[i], scene);
						indexPlayer = i;
						c++;
					}
					else
					{
						playersControl[i].velocity= 0.0;
					}
				}
				if (c== 1 && nPlayer>1)
				{
					playersControl[indexPlayer].velocity= 0.0;
					playersControl[indexPlayer].boxTesta= new  THREE.Box3();

					if (alive == 1)
					{
						controls.autoRotate = true;
						camera.position.x = players[0].getPosition().x + 10;
						camera.position.y = 10;
						camera.position.z = players[0].getPosition().z + 10;

						controls.target = players[0].getPosition();
						//pause = true;
						console.log("player "+playersControl[0].number+" win ");
						
					}

				}

				if (alive == 0)
				{
					if (nPlayer>1)
					{
						console.log(" draw ");
						document.getElementById("winner").innerHTML = "draw";
						document.getElementById("winner").style.display="block";
					}
					else{
						console.log("GAME OVER!");
						//document.getElementById("winner").innerHTML = "GAME OVER!";
						//document.getElementById("winner").style.display="block";
					}
				}

			}
			

function Sound() {

	this.death_sound  = new Audio("audio/explode.mp3");
	this.paddle_sound = new Audio("audio/laser.mp3");
	this.brick_sound  = new Audio("audio/beep.mp3");
	this.brick_sound2 = new Audio("audio/laser.mp3");
	this.level_sound = new Audio("audio/powerup.mp3");
	this.menu_sound = new Audio("audio/menu.mp3");

};

function closeMenu() {
	document.getElementById("start").style.display="none";
	document.getElementById("music").style.display="none";
	document.getElementById("dropdown").style.display="none";
	document.getElementById("dayMode").style.display="none";
	document.getElementById("label_player").style.display="none";
	document.getElementById("label_music").style.display="none";
	document.getElementById("label_night").style.display="none";
};