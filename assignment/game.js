var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var playername =''; //name of the player
var gameinterval; //interval variable
var mylife=3; // life variable
var nothitbybombs=0; // score variable

function keyup(event) {
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	player.className = 'character stand ' + lastPressed;
}


function move() {
	var player = document.getElementById('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop+1;

		var element = document.elementFromPoint(player.offsetLeft, newTop+32);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var newTop = positionTop-1;

		var element = document.elementFromPoint(player.offsetLeft, newTop);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}
		
		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft-1;

		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';	
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft+1;
		
		var element = document.elementFromPoint(newLeft+32, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';		
		}

		player.className = 'character walk right';
	}




}


function keydown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
}


function Airstrike(){ 
			var character = document.getElementById("player"); // playing character on the game
			var airstrikebomb = document.createElement('div');  //div for the new bomb
			airstrikebomb.setAttribute("class", "bomb"); //bomb class added to above div
			airstrikebomb.style.left = Math.floor(Math.random() * window.innerWidth) + 'px'; // random left position 
			document.body.appendChild(airstrikebomb);// added to the screen				
  			var skyportion = document.getElementsByClassName("sky")[0].offsetHeight; //height of the sky element
  			var Explodezone = Math.floor(Math.random() * (window.innerHeight - skyportion)) +skyportion; // random exploding created calculated 
			  var health = document.getElementsByClassName("health")[0]; // health class element
		
	
			  var airstrikeinterval=setInterval(function(){ //interval for dropping
				airstrikebomb.style.top = airstrikebomb.offsetTop + 1 + "px"; // bombs falls by a px on each interval

				if (airstrikebomb.offsetTop > Explodezone) { // if matches the condition that it reached on green area
					airstrikebomb.className = "explosion"; // bomb explodes
			  
					clearInterval(airstrikeinterval); //interval closed
					setTimeout(function () {
						airstrikebomb.remove(); //bomb that exploded is removed 
						var bombaudio = new Audio('./sound/bomb.mp3'); //bomb sound added .
							bombaudio.play();
					}, 1000);


					if (
						airstrikebomb.offsetTop + airstrikebomb.offsetHeight > character.offsetTop &&   //collison detection
						airstrikebomb.offsetTop < character.offsetTop + character.offsetHeight && //collison detection
						airstrikebomb.offsetLeft + airstrikebomb.offsetWidth > character.offsetLeft && //collison detection
						airstrikebomb.offsetLeft < character.offsetLeft + character.offsetWidth//collison detection
					  ) {
						mylife--; // player life is lost
							if(mylife>0){ //if life is greater than 0
								character.classList.add("hit"); // hit class  added to character
								health.removeChild(health.lastElementChild);  // life is lost

								if(mylife==1){ // only 1 remaining
										document.getElementsByClassName('sky')[0].style.background ="linear-gradient(90deg, rgba(255,51,51,1) 0%, rgba(135,206,235,1) 50%, rgba(255,51,51,1) 100%)"; //red color around sides
									
								}
							}
							else{
								document.getElementById("overimage").style.display = "block"; //image displayed
								document.getElementById("restart").style.display = "block"; // image displayed
								health.remove(); //health removed
								character.classList.add("dead"); // dead class added to character
								clearInterval(airstrikeinterval); // interval stopped
								clearInterval(gameinterval);// interval stopped

								if(!localStorage.getItem("Highscorer")){ // no Highscore set
									localStorage.setItem("Highscorer",playername+":"+nothitbybombs); // current score becomes new highscore
								}
								else{
									var oldScore =parseInt(localStorage.getItem("Highscorer").substring(localStorage.getItem("Highscorer").indexOf(':')+1)); //score point taken out of string and converted to int for comparison
									if(oldScore<nothitbybombs){ // if current score is higher 
										localStorage.setItem("Highscorer",playername+":"+nothitbybombs); // new highscore set
									}
								}

								document.getElementsByClassName('halloffame')[0].style.display='block'; // highscore appears, displaye changed from none to block
								document.getElementById('scorer').innerHTML=localStorage.getItem("Highscorer");//Highscore displayed
							}
					}
					else{
						if(mylife>0){
							nothitbybombs++; // point increased
							document.getElementById("myscore").innerHTML = nothitbybombs; //score displayed
						}
					}

				}	

			},10);
}




function BeginGame(){ //function to start the game
	var pressstart =document.getElementsByClassName("start"); // getting the class element "start"
	var pname = document.getElementById('Playername'); // getting the value of input bar
	pressstart[0].addEventListener('click',function(){ //triggering an event with an click
		if(pname.value == ''){ // if no name is inserted
			alert("Please insert name to start the Game."); //Player must insert their name
		}
		else{
			playername =pname.value; //Player name set
			
			pname.remove(); // input bar removed
			pressstart[0].remove(); //start button removed
			setInterval(move, 10); // character moving intertval started
			document.addEventListener('keydown', keydown); // buttons and their event called
			document.addEventListener('keyup', keyup);// buttons and their event called
			gameinterval=setInterval(Airstrike,1000); //interval starts and bombs starts to drop

			document.getElementById('restart').addEventListener('click',function(){ //to restart the Game
				window.location.reload(); //reloads the page location
			});
			
		}

	})
	
}







document.addEventListener('DOMContentLoaded',  BeginGame);