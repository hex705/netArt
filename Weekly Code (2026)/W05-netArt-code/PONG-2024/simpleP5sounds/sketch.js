// sound sample

// //**************************************************
// // pong game day SUBscriptions

// these are RESERVED -- ONLY CURRENT PLAYERS USE THESE PLEASE!

 let subscribeToPlayerOne = "p1"; // playerOne = left side
 let subscribeToPlayerTwo =  "p2"; // playerTwo = right side

// //**************************************************


let theCanvas;
let fs;

function preload(){
  // scoreFont = loadFont('assets/UbuntuMono-Regular.ttf');
  // titleFont = loadFont('assets/Prompt-Bold.ttf');
  hitSound  = loadSound('assets/hit2.mp3');
}

function setup() {

  theCanvas = createCanvas(windowWidth-500, windowHeight-250);
  //console.log(windowWidth +"  "+ windowHeight);
  theCanvas.position(250,125);

  //connect to shiftr these fxns in mqtt.js
  connectMQTT(); // in MQTT tab

}


function draw() {

}// end switch

function windowResized() {
  resizeCanvas(windowWidth-500, windowHeight-250);
}

function mousePressed(){
  hitSound.play();
}

