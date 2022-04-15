// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

// game day subscriptions
//let subscribeToPlayerOne = "playerOne";
//let subscribeToPlayerTwo = "playerTwo";

//**************************************************
// simplified testing subscriptions
let subscribeToPlayerOne = "playerOne";
let subscribeToPlayerTwo = "playerTwo";
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

let STATE = START; // start at 8 -  refactor ?

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
  c = color(200,0,200);
  fieldColor = 'LightGreen';
  paddleColor = color(0,0,255);
  scoreColor = color(243, 156, 18);
  wallColor = 'Purple';//color(255,255,255);
  netColor = 'White';
  ballColor = 'Orange';
  nameColor = 'black';

  //connect to shiftr these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  p = new Pong(1,maximumScore);

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
      //
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

function onMqttMessageArrived(message) {

  //debugIncomingMessage(message);

  // unpack the payload - its a string of form [*,#] even though one data point per message (just like serial)
  let currentString = message.payloadString;
  trim(currentString); // remove white space
  if (!currentString) return; // if empty
  latestData = currentString; // for display

  // parse the incoming string to extract data
  // there will only be an elements[0] at end
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas
  //console.log(elements[1]);
  // grab the topic of the current message
  let theTopic = message.destinationName;

// remove the connect message structure entirely
// simplify this
  if( STATE == AWAIT_PLAYERS) {
    if (theTopic == subscribeToPlayerOne){
      if (!p.players[1].getConnectionStatus()){
        // if false, not connected yet
        console.log("playerONE trying to connect");
        playerConnect(elements[1],elements[0],1);
      }
    }
    if (theTopic == subscribeToPlayerTwo){
      if (!p.players[2].getConnectionStatus()){
        // not connected yet
        console.log("playerTWO not yet connected");
        playerConnect(elements[1],elements[0],2);
      }
    }
  } // wait for players


    //[*,playerName,controllerType,value,#];

  // we are subscribed to two <topics> -- so we must figure out which topic just spoke
  switch (theTopic) {
    case subscribeToPlayerOne:
       playerIndex = 1;
       //playerName = elements[0];
       playerMove = elements[1];
       p.players[1].movePaddle(playerMove);
      break;
    case subscribeToPlayerTwo:
       playerIndex = 2;
       //playerName = elements[0];
       playerMove = elements[1];
       p.players[2].movePaddle(playerMove);

      break;
    default:
      //  do nothing
  }

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
