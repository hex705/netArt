

// //**************************************************
// // pong game day SUBscriptions

// these are RESERVED -- ONLY CURRENT PLAYERS USE THESE PLEASE!

 //let subscribeToPlayerOne = "p1"; // playerOne = left side
 //let subscribeToPlayerTwo = "p2"; // playerTwo = right side

// //**************************************************

//**************************************************
// pong TESTING subscriptions -- match to your controller 

let subscribeToPlayerOne = "stevePongPaddle"; // playerOne = left side
let subscribeToPlayerTwo = "YOURNAME_p2"; // playerTwo = right side
//**************************************************


let theCanvas;
let fs;

let p;

let playerCount = 0;
let numberOfPlayers = 1;
let maximumScore = 3;

// globals for board
let border = 75;
let edgeWidth = 12;
let netWidth = 10;
let colorSet = 0; // 0 = classic, 1 = grass 

// STATE globals
 const START = 0;
 const AWAIT_PLAYERS = 1;
 const SKILL_LEVEL = 2;
 const PLAY  = 3;
 const WIN   = 4;
 const GOAL  = 5;

 const RALLY = 6;
 const SERVE = 7;
 const FLASH = 8;
 const RESET = 9;

let STATE = START; // was START == start at 8 -  refactor ?

let scoreFont;
let titleFont;

let hitSound;

let c;
let paddleColor;
let scoreColor;
let wallColor;
let netColor;
let fieldColor;
let ballColor;
let nameColor;

let playerOneConnected = false;
let playerTwoConnected = false;

let playerIndex = -1;
let playerType = "";
let playerMove = -1;
let playerName = "";



function preload(){
  scoreFont = loadFont('assets/UbuntuMono-Regular.ttf');
  titleFont = loadFont('assets/Prompt-Bold.ttf');
  hitSound  = loadSound('assets/hit2.mp3');
}

function setup() {

  theCanvas = createCanvas(windowWidth-500, windowHeight-250);
  //console.log(windowWidth +"  "+ windowHeight);
  theCanvas.position(250,125);

  // all those colors
  if (colorSet === 0){
       setColorsClassic();
  } else {
       setColorsGrass();
  }

  //connect to shiftr these fxns in mqtt.js
  connectMQTT(); // in MQTT tab

  p = new Pong(1,maximumScore);
  console.log("INITIALIZING PONG");
}

function setColorsClassic(){
      c = color(200,0,200);
      pongLines = color(255,255,255);
      fieldColor = 'black';
      paddleColor =   pongLines;
      scoreColor =   pongLines;
      wallColor =   pongLines;
      netColor =   pongLines;
      ballColor =   pongLines;
      nameColor =   pongLines;
}

function setColorsGrass(){
      c = color(200,0,200);
      fieldColor = 'LightGreen';
      paddleColor = color(0,0,255);
      scoreColor = color(243, 156, 18);
      wallColor = 'Purple';//color(255,255,255);
      netColor = 'White';
      ballColor = 'Orange';
      nameColor = 'black';
}

function draw() {

  switch (STATE) {

    case START:
      maintainScreen();
      getNumberOfPlayers();

    break;

    case AWAIT_PLAYERS:
       maintainScreen();
       displayWaitMessage();

      //  if (playerCount == p.players)  {STATE = INTRO;}
      //if (p.playersConnected == p.playersCount) STATE = SKILL_LEVEL;
    break;

    case SKILL_LEVEL:
        maintainScreen();
        getSkillLevel();
    break;

    case SERVE:
       p.serve();

    break;

    case RALLY:
       p.update();

    break;

    case GOAL:
       sleep(500);
       STATE = SERVE;
      // delay(250);

    break;

    case WIN:
       if ( p.playersCount == 1 ){
         console.log("you lose");
       } else {
       console.log("Player " + p.winner + " wins!!");
       }
       count = 0;
       STATE = FLASH;
    break;

    case FLASH:

      if ( count % 2 == 0 ) {
        c = color(150,0,80);
      }
      else {
        c= color(255);
      }

      p.flashWinner( c );
      sleep(300); // https://www.sitepoint.com/delay-sleep-pause-wait/#:~:text=The%20standard%20way%20of%20creating,()%20%3D%3E%20%7B%20console.
      count++;
      if (count >= 6) STATE = RESET;

    break;

    case RESET:

       p.gameReset();
      
       STATE = START;

    break;

  }// end switch

}

function windowResized() {
  resizeCanvas(windowWidth-500, windowHeight-250);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function playerConnect( _s, _name, _index ) {

  // these are globals
  playerIndex = _index;
  playerType = _s;
  playerName = _name;

  console.log("connecting player " + playerIndex);

  if ( !p.players[playerIndex].getConnectionStatus()) {
      playerCount++;
    //  p.setPlayersConnected(playerIndex);
      p.players[playerIndex].setConnectionStatus(true);
      p.players[playerIndex].setName(playerName);
      p.updatePlayersConnected();
      //playerOneConnected = true;
      console.log("connecting player " + playerIndex);
      // maybe move name to here?
    }

  p.players[playerIndex].movePaddle(127);

}
