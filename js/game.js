
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

			/*=====================*\
			 * START CONFIGURATION *
			\*=====================*/


			var planeWidth = 100;
			var planeHeight = 100;

			var pause = false;
			var velocity = 0.1;
			var dimension = 0.5;
			var wallThick = 1.8;
			var startGame = false;
			var music = false;
			var nightMode = false;
			var hemiLight;

			var firstPlayerControls = {
				number: 1,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0xff3399,
				fanColor: 0xff80bf,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: 0,
			};
			var secondPlayerControls = {
				number: 2,
				dimension: dimension,
				moveLeft: false,
				moveRight: false,
				leftClicked: 0,
				rightClicked: 0,
				color: 0x0bdd43,
				fanColor: 0x55f780,
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
				leftClicked: 0,
				rightClicked: 0,
				color: 0xff9900,
				fanColor: 0xffc266,
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
				leftClicked: 0,
				rightClicked: 0,
				color: 0xfff316,
				fanColor: 0xfff766,
				alive: true,
				velocity: velocity,
				boxWall: [],
				walls: [],
				wallThickness: wallThick,
				boxTesta: new  THREE.Box3(),
			};
			
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
							firstPlayerControls.leftClicked++;
							break;
						case 81: // w
							firstPlayerControls.moveRight = true;
							firstPlayerControls.rightClicked++;
							break;

						case 105: // a
							secondPlayerControls.moveLeft = true;
							secondPlayerControls.leftClicked++;
							break;
						case 104: // d
							secondPlayerControls.moveRight = true;
							secondPlayerControls.rightClicked++;
							break;
						
						case 86: // a
							thirdPlayerControls.moveLeft = true;
							thirdPlayerControls.leftClicked++;
							break;
						case 67: // d
							thirdPlayerControls.moveRight = true;
							thirdPlayerControls.rightClicked++;
							break;
													
						case 188: // a
							fourthPlayerControls.moveLeft = true;
							fourthPlayerControls.leftClicked++;
							break;
						case 190: // d
							fourthPlayerControls.moveRight = true;
							fourthPlayerControls.rightClicked++;
							break;
						case 27: // ESC
							pause = !pause;
							break;
					}
				};
				var onKeyUp = function ( event ) {
					switch( event.keyCode ) {
						case 87: // w
							firstPlayerControls.moveLeft = false;
							firstPlayerControls.leftClicked = 0;
							break;
						case 81: // q
							firstPlayerControls.moveRight = false;
							firstPlayerControls.rightClicked = 0;
							break;

						case 105: // numpad 8
							secondPlayerControls.moveLeft = false;
							secondPlayerControls.leftClicked = 0;
							break;
						case 104: // numpad 9
							secondPlayerControls.moveRight = false;
							secondPlayerControls.rightClicked = 0;
							break;
						
						case 86: // c
							thirdPlayerControls.moveLeft = false;
							thirdPlayerControls.leftClicked = 0;
							break;
						case 67: // v
							thirdPlayerControls.moveRight = false;
							thirdPlayerControls.rightClicked = 0;
							break;
													
						case 188: // period
							fourthPlayerControls.moveLeft = false;
							fourthPlayerControls.leftClicked = 0;
							break;
						case 190: // comma
							fourthPlayerControls.moveRight = false;
							fourthPlayerControls.rightClicked = 0;
							break;
					}
				};




			//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				
				camera.position.x = 0;
				camera.position.y = 85;
				camera.position.z = 0;

	
				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );


				renderer = new THREE.WebGLRenderer({antialias:true});
				//renderer.setClearColor( 0xaaccff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				//controls = new THREE.FirstPersonControls( camera );
				controls = new THREE.OrbitControls( camera, renderer.domElement );

				scene = new THREE.Scene();

				var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
				var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff});
				var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
				scene.add(skyBox);
	
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


  
    





/*
		   // LIGHTS
		    //scene.add(new THREE.AmbientLight(0xffffff,2));

				hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 500, 0 );
				scene.add( hemiLight );
		
			*/


			/*	for (var i = 0; i < alive; i++)
				{
					players[i] = new THREE.Player( playersControl[i],planeWidth, planeHeight, i);
					//console.log(playersControl[i].boxTesta)
				}*/
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
						

						for (var i = 0; i < alive; i++){
							var playerBox = playersControl[i].boxTesta;
							//if(i==0)console.log(i,playerBox);
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
									if (playerBox.intersectsBox(playersControl[o].boxTesta)) 
											{
												console.log("player "+playersControl[i].number+" collide con player"+playersControl[o].number);
												playersControl[i].alive = false;
												playersControl[o].alive= false;

												//playersControl[o].velocity= 0.0;
												//players[i].stira(playersControl[o]);
												lunghezza = 0;
						
											}
								}

								for (; j<lunghezza; j++)
									{			
										
										if (playerBox.intersectsBox(playersControl[o].boxWall[j]))
										{	
											console.log('player '+playersControl[i].number+' collide con muro di '+playersControl[o].number)
											playersControl[i].alive = false;
											//playersControl[i].velocity= 0.0;
											//players[i].stira(playersControl[i]);
										}
									}
								}
							}
						
						var ciclo = alive;
						for (var i = 0; i < ciclo; i++)
						{
							if (playersControl[i].alive)
								players[i].updatePlayerModel(playersControl[i], scene, planeWidth, planeHeight);
							else
							{
								ciclo--;
								playersControl[i].velocity= 0.0;
								players[i].stira(playersControl[i]);
								players.splice(i,1);
								playersControl.splice(i,1);
							}
						}
						alive = ciclo;
						if(alive == 1 && nPlayer>alive)
						{
							console.log("player "+playersControl[0].number+" win ");
							document.getElementById("winner").innerHTML = "player "+playersControl[0].number+" win ";
							document.getElementById("winner").style.display="block";

							playersControl[0].velocity = 0.0;

							//alive -= 1;
						}
						else if (alive == 0)
						{
							if (nPlayer>1)
							{
								console.log(" draw ");
								document.getElementById("winner").innerHTML = "draw";
							document.getElementById("winner").style.display="block";
							}
							else
								console.log("GAME OVER!");
						}

					}
				}
				else
 				{
 					//document.body.background = "images/background.jpg";
 					document.getElementById("start").onclick = function(){

						var e = document.getElementById("dropdown");
						nPlayer = e.options[e.selectedIndex].value;

						if(music)
						{
							sound = new Sound();
							sound.menu_sound.play();
						}	
						if (nightMode)
						{
																	   // LIGHTS
					    //scene.add(new THREE.AmbientLight(0xffffff,2));

							hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.0 );
							hemiLight.color.setHSL( 0.6, 1, 0.6 );
							hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
							hemiLight.position.set( 0, 500, 0 );
							scene.add( hemiLight );
						}
						else
						{
																	   // LIGHTS
					    //scene.add(new THREE.AmbientLight(0xffffff,2));

							hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.5 );
							hemiLight.color.setHSL( 2, 1, 2 );
							hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
							hemiLight.position.set( 0, 500, 0 );
							scene.add( hemiLight );
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

 					document.getElementById("night").onclick = function(){

						if(nightMode)
 						{
 							document.getElementById("night").innerHTML = "OFF";
    					document.getElementById("night").style.color = 'red';
 						}
 						else
 						{
 							document.getElementById("night").innerHTML = "ON";
    					document.getElementById("night").style.color = 'green';
 						}
 						nightMode = !nightMode;
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

			// render scene
				renderer.render( scene, camera );
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
						document.getElementById("label_player").style.display="none";
						document.getElementById("label_music").style.display="none";
						document.getElementById("label_night").style.display="none";
						document.getElementById("night").style.display="none";
};