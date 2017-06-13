//KEYBOARD CONTROLS
var onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
		case firstPlayerControls.keyL: // q
			firstPlayerControls.moveLeft = true;
			break;
		case firstPlayerControls.keyR: // w
			firstPlayerControls.moveRight = true;
			break;

		case secondPlayerControls.keyL: // a
			secondPlayerControls.moveLeft = true;
			break;
		case secondPlayerControls.keyR: // d
			secondPlayerControls.moveRight = true;
			break;
		
		case thirdPlayerControls.keyL: // a
			thirdPlayerControls.moveLeft = true;
			break;
		case thirdPlayerControls.keyR: // d
			thirdPlayerControls.moveRight = true;
			break;
									
		case fourthPlayerControls.keyL: // a
			fourthPlayerControls.moveLeft = true;
			break;
		case fourthPlayerControls.keyR: // d
			fourthPlayerControls.moveRight = true;
			break;
		case 27: // ESC
			if(startGame)
			{
				pause = !pause;

				if (pause){
					sound.menu_sound.pause();
					
				}
				else if(sound.music == 2)
					sound.menu_sound.play();

				if(pause)
					document.getElementById("pause").setAttribute("style","display:inline");
				else{
					if (keyPause)
						document.getElementById("keyMenu").setAttribute("style","display:none");
					document.getElementById("pause").setAttribute("style","display:none");
				}
			}

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
		case 54: //FIST PERSON CAMERA
		if(nPlayer == 1){
			follow = true;
			cameraPose.set(players[0].getPosition().x,players[0].getPosition().y,players[0].getPosition().z);
			playerToFollow = 0;
		}
			break;
		default:
			if(firstPlayerControls.keyL<0){
				firstPlayerControls.keyL=event.keyCode;
				document.getElementById("FirstL").innerHTML = String.fromCharCode(firstPlayerControls.keyL);
			}
			else if(firstPlayerControls.keyR<0){
				firstPlayerControls.keyR=event.keyCode;
				document.getElementById("FirstR").innerHTML = String.fromCharCode(firstPlayerControls.keyR);
			}
			else if(secondPlayerControls.keyL<0){
				
				secondPlayerControls.keyL=event.keyCode;
				document.getElementById("SecondL").innerHTML = String.fromCharCode(secondPlayerControls.keyL);
			}
			else if(secondPlayerControls.keyR<0){
				secondPlayerControls.keyR=event.keyCode;
				document.getElementById("SecondR").innerHTML = String.fromCharCode(secondPlayerControls.keyR);
			}
			else if(thirdPlayerControls.keyL<0){
				thirdPlayerControls.keyL=event.keyCode;
				document.getElementById("ThirdL").innerHTML = String.fromCharCode(thirdPlayerControls.keyL);
			}
			else if(thirdPlayerControls.keyR<0){
				thirdPlayerControls.keyR=event.keyCode;
				document.getElementById("ThirdR").innerHTML = String.fromCharCode(thirdPlayerControls.keyR);
			}
			else if(fourthPlayerControls.keyL<0){
				fourthPlayerControls.keyL=event.keyCode;
				document.getElementById("FourthL").innerHTML = String.fromCharCode(fourthPlayerControls.keyL);
			}
			else if(fourthPlayerControls.keyR<0){
				fourthPlayerControls.keyR=event.keyCode;
				document.getElementById("FourthR").innerHTML = String.fromCharCode(fourthPlayerControls.keyR);
			}
			break;
	}
};
var onKeyUp = function ( event ) {
	switch( event.keyCode ) {
		case firstPlayerControls.keyL: // w
			firstPlayerControls.moveLeft = false;
			firstPlayerControls.pushed = false;
			break;
		case firstPlayerControls.keyR: // q
			firstPlayerControls.moveRight = false;
			firstPlayerControls.pushed = false;
			break;

		case secondPlayerControls.keyL: // numpad 8
			secondPlayerControls.moveLeft = false;
			secondPlayerControls.pushed = false;
			break;
		case secondPlayerControls.keyR: // numpad 9
			secondPlayerControls.moveRight = false;
			secondPlayerControls.pushed = false;
			break;
		
		case thirdPlayerControls.keyL: // c
			thirdPlayerControls.moveLeft = false;
			thirdPlayerControls.pushed = false;
			break;
		case thirdPlayerControls.keyR: // v
			thirdPlayerControls.moveRight = false;
			thirdPlayerControls.pushed = false;
			break;
									
		case fourthPlayerControls.keyL: // period
			fourthPlayerControls.moveLeft = false;
			fourthPlayerControls.pushed = false;
			break;
		case fourthPlayerControls.keyR: // comma
			fourthPlayerControls.moveRight = false;
			fourthPlayerControls.pushed = false;
			break;
	}
};
