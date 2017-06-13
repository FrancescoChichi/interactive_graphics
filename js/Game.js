			if ( ! Detector.webgl ) {
				Detector.addGetWebGLMessage();
				document.getElementById( 'container' ).innerHTML = "";
			}
			var container, stats;
			var camera, menuCamera, controls,controlsMenu, gameScene, menuScene, renderer;
			var mesh, texture, geometry, material;
			var worldWidth = 128, worldDepth = 128;
			var ship, shipControl;
			var sound;
			var gameEnd = false;
			var currentScene;

			var piedistallo;
			/*=====================*\
			 * START CONFIGURATION *
			\*=====================*/

			var planeWidth = 100;
			var planeHeight = 100;
			var lightModality = "";

			var time = Math.random();
			var pause = false;
			var velocity = 0.3;
			var dimension = 0.5;
			var wallThick = 0.8;
			var startGame = false;
			var hemiLight;
			var halo,haloMenu;
			var keyPause = false;

			var animatedLights = [];
			var wins = [0,0,0,0];

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
				keyL: 87,
				keyR: 81

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
				keyL: 105,
				keyR: 104

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
				keyL: 67,
				keyR: 88

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
				keyL: 190,
				keyR: 188
			};
			
			

			playersControl = [firstPlayerControls, secondPlayerControls, thirdPlayerControls, fourthPlayerControls];
			players = [];
			nPlayer = 4;

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


				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );


				renderer = new THREE.WebGLRenderer({antialias:true});
				//renderer.setClearColor( 0xaaccff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				sound = new Sound();

				createMenuScene();

				//POWER UP
					//******renderer******
				container.innerHTML = "";
				container.appendChild( renderer.domElement );
				stats = new Stats();
				stats.showPanel( 1 );
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
						if(!gameEnd)
						{
							collision();
							checkEnd();
						}
					}
					else
						{
							//gioco in pausa;
								document.getElementById("resume").onclick = function()
								{
						if (sound.music >1)
									sound.beep_sound.play();
									if(sound.music>=	1)
									{
										sound.menu_sound.play();
									}	
									pause = false;
									document.getElementById("container").setAttribute("style","display:inline");
									document.getElementById("pause").setAttribute("style","display:none");
								}
								document.getElementById("menu").onclick = function()
								{
						if (sound.music >1)
									sound.beep_sound.play();
									window.location.reload(true);
									currentScene=menuScene;

									document.getElementById("container").setAttribute("style","display:inline");
									document.getElementById("pause").setAttribute("style","display:none");
								}
								document.getElementById("keyPause").onclick = function()
								{
						if (sound.music >1)
									sound.beep_sound.play();
									keyPause = true;
									document.getElementById("pause").setAttribute("style","display:none");
									document.getElementById("keyMenu").setAttribute("style","display:inline");
								}
								document.getElementById("back").onclick = function()
								{
						if (sound.music >1)
									sound.beep_sound.play();
									keyPause = false;
									document.getElementById("pause").setAttribute("style","display:inline");
									document.getElementById("keyMenu").setAttribute("style","display:none");
								}

						}
				}
				else //GIOCO IN PAUSA
 				{

	document.getElementById("FirstL").onclick = function(){
			playersControl[0].keyL = -1;
		}
		document.getElementById("FirstR").onclick = function(){
			playersControl[0].keyR = -1;
		}
		document.getElementById("SecondL").onclick = function(){
			playersControl[1].keyL = -1;
		}
		document.getElementById("SecondR").onclick = function(){
			playersControl[1].keyR = -1;
		}
		document.getElementById("ThirdL").onclick = function(){
			playersControl[2].keyL = -1;
		}
		document.getElementById("ThirdR").onclick = function(){
			playersControl[2].keyR = -1;
		}
		document.getElementById("FourthL").onclick = function(){
			playersControl[3].keyL = -1;
		}
		document.getElementById("FourthR").onclick = function(){
			playersControl[3].keyR = -1;
		}

					document.getElementById("key").onclick = function()
					{
						if (sound.music >1)
							sound.beep_sound.play();
						document.getElementById("mainPage").setAttribute("style","display:none");
						document.getElementById("keyMenu").setAttribute("style","display:inline");
					}
					document.getElementById("back").onclick = function()
					{
						if (sound.music >1)
							sound.beep_sound.play();
						document.getElementById("mainPage").setAttribute("style","display:inline");
						document.getElementById("keyMenu").setAttribute("style","display:none");
					}

					document.getElementById("startAgain").onclick = function()
					{
						gameScene = null;
						createGameScene()
						gameEnd = false;
						startGame = true; 
 						alive = nPlayer;
						halo.rotateHalo(Math.PI);
						players = [0,0,0,0];
 						for (var i = 0; i < alive; i++)
							players[i] =  new THREE.Player( playersControl[i],planeWidth, planeHeight, i);

					}

 					document.getElementById("start").onclick = function()
					{

						if(document.getElementById("all").checked)
						{
							sound.music=2;
							sound.beep_sound.play();
						}
						else if(document.getElementById("events").checked)
							{
								sound.music=1;							
							}

						createGameScene();
						//while(this.ship.render(false,1));

						if(  document.getElementById("1").checked)
						nPlayer = 1;
						else if(document.getElementById("2").checked)
						nPlayer = 2;
						else if(document.getElementById("3").checked)
						nPlayer = 3;
						else nPlayer = 4;
						
						//LIGHT MODE
						if (document.getElementById("night").checked){
							lightModality = "night";
							halo.rotateHalo(Math.PI);
						}
						else if (document.getElementById("day").checked)
							lightModality = "day";
						else
							lightModality = "cycle";

						if(sound.music>=1)
						{
							sound.menu_sound.play();
						}	

 						startGame = true; 
 						alive = nPlayer;

 						for (var i = 0; i < alive; i++)
							players[i] = new THREE.Player( playersControl[i],planeWidth, planeHeight, i);
						
						document.getElementById("mainPage").setAttribute("style","display:none");


						if(nPlayer == 1){
							follow = true;
							camera.position.copy(players[0].getPosition());

							playerToFollow = 0;
						}

 					};
 				}
 				if(startGame)
 				{
					render();
					stats.update();
				}	
				else
				{
					renderMenu();
					stats.update();
				}

			}

			function renderMenu() {

				var delta = clock.getDelta();
				controlsMenu.update(delta);			
 				time += 0.005;				
 				//shipControl.render(1.0);
 				
 				ship1.rotateY(THREE.Math.degToRad(+0.2));
 				ship2.rotateY(THREE.Math.degToRad(+0.2));
 				ship3.rotateY(THREE.Math.degToRad(+0.2));
 				ship4.rotateY(THREE.Math.degToRad(+0.2));
 				
 				haloMenu.animate();
 				//shipControl.render(2);
 				shipControl1.updateParticle();
 				shipControl2.updateParticle();
 				shipControl3.updateParticle();
 				shipControl4.updateParticle();
				renderer.render( menuScene, menuCamera );
			}

			function render() {

				var delta = clock.getDelta();
				controls.update( delta );

				if(!pause)
				{				
					time += 0.005;				

					if(lightModality == "cycle")
						halo.animate();

					for (var i = animatedLights.length - 1; i >= 0; i--) {
						animatedLights[i].render();
					};


					for (var i = 0; i < alive; i++)
					{
						if(players[i].render( time, playersControl[i], sound )){
							players.splice(i,1);
							playersControl.splice(i,1);
							alive--;
							//pause = true;
						}
					}

				}

				if(cameraPose.x!=cameraPoseBK.x||cameraPose.y!=cameraPoseBK.y||cameraPose.z!=cameraPoseBK.z){
					camera.position.set(cameraPose.x,cameraPose.y,cameraPose.z);
					cameraPoseBK.set(cameraPose.x,cameraPose.y,cameraPose.z);
				}
				if (follow && nPlayer == 1 && alive == 1){
					var x = new THREE.Vector3(players[playerToFollow].getOrientation().x * 10,players[playerToFollow].getOrientation().y * 10,players[playerToFollow].getOrientation().z * 10);
					var y = new THREE.Vector3(players[playerToFollow].getOrientation().x * 5,
						players[playerToFollow].getOrientation().y * 5,
						players[playerToFollow].getOrientation().z * 5);

					camera.position.set(players[playerToFollow].getPosition().x-y.x,players[playerToFollow].getPosition().y+5,players[playerToFollow].getPosition().z-y.z);
					controls.target.set(players[playerToFollow].getPosition().x+x.x,players[playerToFollow].getPosition().y,players[playerToFollow].getPosition().z+x.z);
				}


				renderer.render( gameScene, camera );
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
						players[i].updatePlayerModel(playersControl[i], gameScene);
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
						//document.getElementById("winner").innerHTML = "player "+playersControl[0].number+" win ";
						document.getElementById("winner").style.display="block";
						wins[playersControl[0].number-1]+=1;
						console.log(wins);
						gameEnd = true;
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
						document.getElementById("winner").innerHTML = "Game Over";
						document.getElementById("winner").style.display="block";
					}
					gameEnd = true;
				}
			
			}
		

function createGameScene()
{

			container = document.getElementById( 'container' );

			resetPlayerControls();

			sound = new Sound();

			//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

				camera.position.set(0.0,90.0,0.0);

				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = 1.5;
				controls.minDistance= 0;
				controls.maxDistance= worldWidth *1.5;


				gameScene = new THREE.Scene();

				currentScene=gameScene;

				var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
				var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff});
				var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
				gameScene.add(skyBox);
	
				groundGeometry = new THREE.BoxBufferGeometry( planeWidth,1, planeHeight );
				var groundTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
				groundTexture.repeat.set( 10, 10 );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.magFilter = THREE.NearestFilter;
				groundTexture.format = THREE.RGBFormat;

				// GROUND
				var groundMaterial = new THREE.MeshPhongMaterial( {
					shininess: 0,
					color: 0xffffff,
					side: THREE.DoubleSide,
					transparent:true,
					opacity:0.7,
					map: groundTexture
				} );

				material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: groundTexture } ); 
				ground = new THREE.Mesh( groundGeometry, groundMaterial );
				//ground.scale.set( 1000, 1000, 1000 );

				//ground.receiveShadow = true;

				gameScene.add(ground);

			//SKYBOX
	

			var prefix = "textures/halo/";
			var suffix = ".jpg";
			var urls  = [prefix+"haloBELLO"+suffix,  //back
									 prefix+"haloBELLO"+suffix, 	//front
									 prefix+"haloBELLO"+suffix,  //up
									 prefix+"halo"+suffix,  //down

							 prefix+"haloBELLO90"+suffix,  //left
									 prefix+"haloBELLO90"+suffix]; //right
			
			var reflectionCube = new THREE.CubeTextureLoader().load( urls );
			reflectionCube.format = THREE.RGBFormat;

			gameScene.background = reflectionCube;

				//MAP WALLS
				var mesh = new THREE.Mesh(
					new THREE.BoxBufferGeometry(
							-worldWidth*1.001,
							0.01,
							worldWidth*1.001), 
					new THREE.MeshBasicMaterial( {
							color: 0xff3300, 
							opacity: 0.2,
							transparent: true,

						}));
				mesh.position.set(0,-0.5,0);

				gameScene.add(mesh);


				halo = new THREE.Halo(worldWidth);

				gameScene.add(halo.getTorus());

				//POWER UP
				animatedLights.push(new THREE.animatedLight( planeHeight,planeWidth,Math.random() * 0xffffff,50));
				animatedLights.push(new THREE.animatedLight( planeHeight,planeWidth,Math.random() * 0xffffff,50));
				animatedLights.push(new THREE.animatedLight( planeHeight,planeWidth,Math.random() * 0xffffff,50));
				animatedLights.push(new THREE.animatedLight( planeHeight,planeWidth,Math.random() * 0xffffff,50));
				
				//******renderer******
				/*
				container.innerHTML = "";
				container.appendChild( renderer.domElement );
				stats = new Stats();
				stats.showPanel( 1 );
				container.appendChild( stats.dom );*/
				//
};

function createMenuScene()
{
				//CAMERA SETTINGS
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				menuCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

				camera.position.set(0.0,90.0,0.0);
				menuCamera.position.set(15.0,4.0,25.0);

				//controls = new THREE.FirstPersonControls( camera );
				controlsMenu = new THREE.OrbitControls( camera, renderer.domElement );
				controlsMenu.maxPolarAngle = 1.5;
				controlsMenu.minDistance= 0;
				controlsMenu.maxDistance= worldWidth *1.5;


				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = 1.5;
				controls.minDistance= 0;
				controls.maxDistance= worldWidth *1.5;


				menuScene = new THREE.Scene();
				currentScene=menuScene;


				groundGeometry = new THREE.BoxBufferGeometry( planeWidth,1, planeHeight );
				var groundTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
				groundTexture.repeat.set( 10, 10 );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.magFilter = THREE.NearestFilter;
				groundTexture.format = THREE.RGBFormat;

				// GROUND
				var groundMaterial = new THREE.MeshPhongMaterial( {
					shininess: 0,
					color: 0xffffff,
					side: THREE.DoubleSide,
					transparent:true,
					opacity:0.7,
					map: groundTexture
				} );

				material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: groundTexture } ); 
				ground = new THREE.Mesh( groundGeometry, groundMaterial );

				shipControl1 = new THREE.Ship(firstPlayerControls,0.30);
				ship1 = shipControl1.getAll();
				ship1.position.set(-10,wins[0]/2+1.5,3);
				var piedistallo = new THREE.Mesh(new Geometry([2, 2, wins[0], 64]).cylinder,
				new Material(50,0xffffff,0xffffff,5,1).metalDoubleSide);
				piedistallo.position.set(-10,wins[0]/2+0.1,3);
				menuScene.add(piedistallo);

				shipControl2 = new THREE.Ship(secondPlayerControls,0.3);
				ship2 = shipControl2.getAll();
				ship2.position.set(-5,wins[1]/2+1.5,0);
				piedistallo = new THREE.Mesh(new Geometry([2, 2,  wins[1], 64]).cylinder,
				new Material(50,0xffffff,0xffffff,5,1).metalDoubleSide);
				piedistallo.position.set(-5,wins[1]/2+0.1,0);
				menuScene.add(piedistallo);
				
				shipControl3 = new THREE.Ship(thirdPlayerControls,0.3);
				ship3 = shipControl3.getAll();
				ship3.position.set(3,wins[2]/2+1.5,0);
				piedistallo = new THREE.Mesh(new Geometry([2, 2,  wins[2], 64]).cylinder,
				new Material(50,0xffffff,0xffffff,5,1).metalDoubleSide);
				piedistallo.position.set(3,wins[2]/2+0.1,0);
				menuScene.add(piedistallo);
				
				shipControl4 = new THREE.Ship(fourthPlayerControls,0.3);
				ship4 = shipControl4.getAll();
				ship4.position.set(10,wins[3]/2+1.5,3);
				piedistallo = new THREE.Mesh(new Geometry([2, 2,  wins[3], 64]).cylinder,
				new Material(50,0xffffff,0xffffff,5,1).metalDoubleSide);
				piedistallo.position.set(10,wins[3]/2+0.1,3);
				menuScene.add(piedistallo);
				
				
				menuScene.add(ship1);
				menuScene.add(ship2);
				menuScene.add(ship3);
				menuScene.add(ship4);

				menuScene.add(ground.clone());

			//SKYBOX
	

			var prefix = "textures/halo/";
			var suffix = ".jpg";
			var urls  = [prefix+"haloBELLO"+suffix,  //back
									 prefix+"haloBELLO"+suffix, 	//front
									 prefix+"haloBELLO"+suffix,  //up
									 prefix+"halo"+suffix,  //down

							 prefix+"haloBELLO90"+suffix,  //left
									 prefix+"haloBELLO90"+suffix]; //right
			
			var reflectionCube = new THREE.CubeTextureLoader().load( urls );
			reflectionCube.format = THREE.RGBFormat;

			menuScene.background =reflectionCube



				haloMenu = new THREE.Halo(worldWidth);

				menuScene.add(haloMenu.getTorus());

}

function resetPlayerControls()
{
	playersControl = [firstPlayerControls, secondPlayerControls, thirdPlayerControls, fourthPlayerControls];

	for (var i = playersControl.length - 1; i >= 0; i--) {

		playersControl[i].alive = true;
		playersControl[i].pushed = false;
		playersControl[i].moveLeft = false;
		playersControl[i].moveRight = false;
		playersControl[i].velocity = velocity;
		playersControl[i].boxTesta = new THREE.Box3();
		playersControl[i].walls = [];
		playersControl[i].boxWall = [];
	};
}



function Sound() {
	this.music = 0;
	this.death_sound  = new Audio("audio/explode.mp3");
	this.menu_sound = new Audio("audio/menu.mp3");
	this.beep_sound = new Audio("audio/beep.mp3");
	this.menu_sound.loop=true;
};
