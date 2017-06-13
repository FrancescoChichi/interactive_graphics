
if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

var container, stats;
var camera, menuCamera, controls,controlsMenu, gameScene, menuScene, renderer;
var mesh, texture, geometry, material;
var worldWidth = 128, worldDepth = 128;
var ship, shipControl;

/*=====================*\
 * START CONFIGURATION *
\*=====================*/

var planeWidth = 100;
var planeHeight = 100;
var lightModality = "";

var time = Math.random();
var pause = false;
var velocity = 0.1;
var dimension = 0.5;
var wallThick = 0.8;
var startGame = false;
var music = 0;
var hemiLight;
var halo;
var keyPause = false;

var firstPlayerControls = {
	number: 1,
	dimension: dimension,
	moveLeft: false,
	moveRight: false,
	leftClicked: 0,
	rightClicked: 0,
	color: 0xff0000,
	alive: true,
	velocity: velocity,
	boxWall: [],
	walls: [],
	wallThickness: wallThick,
	boxTesta: 0,
	keyL: 87,
	keyR: 81
};
var secondPlayerControls = {
	number: 2,
	dimension: dimension,
	moveLeft: false,
	moveRight: false,
	leftClicked: 0,
	rightClicked: 0,
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
	leftClicked: 0,
	rightClicked: 0,
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
	leftClicked: 0,
	rightClicked: 0,
	color: 0xff3399,
	alive: true,
	velocity: velocity,
	boxWall: [],
	walls: [],
	wallThickness: wallThick,
	boxTesta: new  THREE.Box3(),
	keyL: 190,
	keyR: 188
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
/*===================*\
 * END CONFIGURATION *
\*===================*/


init();
animate();
function init() {
	container = document.getElementById( 'container' );
	sound = new Sound();

//CAMERA SETTINGS
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	menuCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

	camera.position.set(0.0,90.0,0.0);
	menuCamera.position.set(10.0,4.0,20.0);


	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );


	renderer = new THREE.WebGLRenderer({antialias:true});
	//renderer.setClearColor( 0xaaccff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	//controls = new THREE.FirstPersonControls( camera );
	controlsMenu = new THREE.OrbitControls( camera, renderer.domElement );
	controlsMenu.maxPolarAngle = 1.5;
	controlsMenu.minDistance= 0;
	controlsMenu.maxDistance= worldWidth *1.5;


	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = 1.5;
	controls.minDistance= 0;
	controls.maxDistance= worldWidth *1.5;


	gameScene = new THREE.Scene();
	menuScene = new THREE.Scene();

	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff});
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	gameScene.add(skyBox);

//GROUND
	groundGeometry = new THREE.PlaneBufferGeometry( planeWidth, planeHeight );
	groundGeometry.rotateX( - Math.PI / 2 );

	ground = new THREE.Mesh( groundGeometry, new Material(0,0xffffff,0,10,10).ground);

	ground.receiveShadow = true;

	gameScene.add( ground );

	shipControl = new THREE.Ship(secondPlayerControls,0x000551);
	ship = shipControl.getAll();
	ship.scale.set(.5,.5,.5);
	menuScene.add(ship);

	menuScene.add(new THREE.Mesh(new Geometry([5, 5, 3, 64]).cylinder, new Material(50,0xffffff,0xffffff,5,1).metalDoubleSide));


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
	gameScene.add(new THREE.Mesh(
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

	gameScene.add(halo.getTorus());


	//POWER UP
	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );


	light1 = new THREE.PointLight( 0xff0040, 2, lightPower );
	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
	gameScene.add( light1 );
	
	light2 = new THREE.PointLight( 0x0040ff, 2, lightPower );
	light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
	gameScene.add( light2 );


	light3 = new THREE.PointLight( 0x80ff80, 2, lightPower );
	light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
	gameScene.add( light3 );

	light4 = new THREE.PointLight( 0xffaa00, 2, lightPower );
	light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
	gameScene.add( light4 );


	var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
	menuScene.add(light);


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
function test(){
	document.addEventListener( 'keydown', onKeyDown, false );

	console.log(event.keyCode);
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

					if(playersControl[i].alive == false || playersControl[o].alive == false)
						continue;

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
									lunghezza = 0;
			
								}
					}

					for (; j<lunghezza; j++)
						{			
							
							if (playerBox.intersectsBox(playersControl[o].boxWall[j]))
							{	
								console.log('player '+playersControl[i].number+' collide con muro di '+playersControl[o].number)
								playersControl[i].alive = false;
							}
						}
					}
				}
			
			//var ciclo = alive;
			var c = 0;
			var indexPlayer = 0;
			for (var i = 0; i < alive; i++)
			{
				if (playersControl[i].alive){
					players[i].updatePlayerModel(playersControl[i], gameScene, planeWidth, planeHeight);
					indexPlayer = i;
					c++;
				}
				else
				{
					playersControl[i].velocity= 0.0;
				}
			}
			if (c == 1 && nPlayer>1)
				playersControl[indexPlayer].velocity=0.0;
			//alive = ciclo;
			if(alive == 1 && nPlayer>alive)
			{
				console.log("player "+playersControl[0].number+" win ");
				//document.getElementById("winner").innerHTML = "player "+playersControl[0].number+" win ";
				//document.getElementById("winner").style.display="block";

				controls.autoRotate = true;
				camera.position.x = players[0].getPosition().x + 10;
				camera.position.y = 10;
				camera.position.z = players[0].getPosition().z + 10;

				controls.target = players[0].getPosition();
				pause = true;
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
				else{
					console.log("GAME OVER!");
					//document.getElementById("winner").innerHTML = "GAME OVER!";
					//document.getElementById("winner").style.display="block";
				}
			}
		}

		else
			{
				//gioco in pausa;
					document.getElementById("resume").onclick = function()
					{
						if(music>1)
						{
							sound.menu_sound.play();
						}	
						pause = false;
						//document.getElementById("container").setAttribute("style","display:inline");
						document.getElementById("pause").setAttribute("style","display:none");
					}
					document.getElementById("menu").onclick = function()
					{
						window.location.reload(true);
						//document.getElementById("container").setAttribute("style","display:inline");
						document.getElementById("pause").setAttribute("style","display:none");
					}
					document.getElementById("keyPause").onclick = function()
					{
						keyPause = true;
						document.getElementById("pause").setAttribute("style","display:none");
						document.getElementById("keyMenu").setAttribute("style","display:inline");
					}
					document.getElementById("back").onclick = function()
					{
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
			document.getElementById("mainPage").setAttribute("style","display:none");
			document.getElementById("keyMenu").setAttribute("style","display:inline");
		}
		document.getElementById("back").onclick = function()
		{
			document.getElementById("mainPage").setAttribute("style","display:inline");
			document.getElementById("keyMenu").setAttribute("style","display:none");
		}

			document.getElementById("start").onclick = function()
		{

			if(  document.getElementById("1").checked)
			nPlayer = 1;
			else if(document.getElementById("2").checked)
			nPlayer = 2;
			else if(document.getElementById("3").checked)
			nPlayer = 3;
			else nPlayer = 4;


			//MUSIC SELECTION
			if(document.getElementById("all").checked)
				music = 2; //MUSIC + EVENT
			else if(document.getElementById("events").checked)
				music = 1;


			//LIGHT MODE
			if (document.getElementById("night").checked){
				lightModality = "night";
				halo.rotateHalo(Math.PI);
			}
			else if (document.getElementById("day").checked)
				lightModality = "day";
			else
				lightModality = "cycle";


			

			if(music>1)
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
				camera.position.set(players[0].getPosition().x,players[0].getPosition().y,players[0].getPosition().z);
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
	shipControl.render(0.0);
	ship.rotateY(THREE.Math.degToRad(+0.2));
	shipControl.updateParticle();
	shipControl.changeColor();

	renderer.render( menuScene, menuCamera );
}


function render() {

	var delta = clock.getDelta();
	controls.update( delta );

	var dist = 30;
	var scale = 0.9;
	var vel = 3;
	var boh = 100;
	if(!pause)
	{				
		time += 0.005;				

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

	}

	for (var i = 0; i < alive; i++)
		if(players[i].render( time, playersControl[i], sound, music )){
			players.splice(i,1);
			playersControl.splice(i,1);
			alive--;
		}

	if (follow && nPlayer == 1){
		var x = new THREE.Vector3(players[0].getOrientation().x * 10,players[0].getOrientation().y * 10,players[0].getOrientation().z * 10);
		var y = new THREE.Vector3(players[0].getOrientation().x * 5,
			players[0].getOrientation().y * 5,
			players[0].getOrientation().z * 5);

		camera.position.set(players[0].getPosition().x-y.x,players[0].getPosition().y+5,players[0].getPosition().z-y.z);
		controls.target.set(players[0].getPosition().x+x.x,players[0].getPosition().y,players[0].getPosition().z+x.z);
	}
	else if(cameraPose.x!=cameraPoseBK.x||cameraPose.y!=cameraPoseBK.y||cameraPose.z!=cameraPoseBK.z){
		camera.position.set(cameraPose.x,cameraPose.y,cameraPose.z);
		cameraPoseBK.set(cameraPose.x,cameraPose.y,cameraPose.z);
		controls.target.set(0,0,0);
		follow = false;
	}

	renderer.render( gameScene, camera );
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
