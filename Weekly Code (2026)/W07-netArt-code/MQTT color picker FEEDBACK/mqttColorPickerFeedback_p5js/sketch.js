/*

p5.js Serial color picker

3 sliders select RGB values

the values are then sent to RGB LED attached to a feather

created for netArt by hex705 (steve daniels) , Feb 2022

*/

// MQTT - shiftr 
// PUBLISH TOPIC
let myPublishTopic = "steveRGB";
let payload = "empty";

//SUBscribe topic
let feedbackSubscribeTopic = "steveFeedback"; 

// message protocol variables 
let glue;
let scissors;

let receivedValue = 10;

// ***** graphical elements ******
let myColor;
// sliders
let rSlider,gSlider, bSlider; 

// slider values 
let rValue, gValue, bValue; 

// feedbackValues
let feedbackRed=0, feedbackGreen=0, feedbackBlue=0;
let feedbackColor;
let incomingPayload; 

// drwn bits
let theCanvas
let sendButton;

function setup() {
  // canvas basics
  theCanvas = createCanvas(1000,750);
  theCanvas.position(20, 100);
  colorMode(RGB, 255);

  //connect to CHANNEL -shiftr- use these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();

  createSliders();
  createSendButton();
}


// drawing stuff
function draw() {
  background(255);
  drawScreen();
}

function drawScreen(){

  let topSpacer = 35;
  let sideSpacer = 25;
  let base = 300;

  // draw current color choice
  myColor = color(rValue, gValue,bValue);
  fill(myColor);
  rect(sideSpacer, topSpacer, base, base);

  // draw feedback color 
  feedbackColor = color(feedbackRed, feedbackGreen, feedbackBlue);
  fill(feedbackColor);
  rect(sideSpacer, topSpacer*3+base+5, base, base/3);
  
  // feedback label
  fill(87,87,87);
  textSize(32);

  //feedback message
  text('recieved from arduino ',sideSpacer,topSpacer*3+base);
  fill(87,87,87);
  textSize(16);
  text('color from arduino:: '+incomingPayload,350, 475);


  // interface labels
  fill(87,87,87);
  textSize(32);
  text('choose a color ',sideSpacer,30);
  
  // slider labels
  textSize(17);
  text('Red   ('+rSlider.value()+')',350,240);
  text('Green ('+gSlider.value()+')',350,265);
  text('Blue  ('+bSlider.value()+')',350,290);

}

// generic way of tracking all the sliders
// not a very JS solution but it works.
// all colors captured when mouse is released
function mouseReleased() {
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();
}


// message builder, specific to this project

function buildColorMessage(){

  // format slider numbers for arduino
  // round color channels down
  let r = floor(red(myColor));
  let g = floor(green(myColor));
  let b = floor(blue(myColor));

  // check for errors -- make sure all teh colors are number type
  if ( isNaN(r) || isNaN(g) || isNaN(b)){
    console.log ( 'malformed message'); 
    // since no update to package, will resend last good message
  } else {
    // good message send it to shiftr
    assembleMessage(r,g,b);
  }
  
}

// use glue to build our message 
function assembleMessage (rVal, gVal, bVal){
  // send values to arduino
  // glue is a GLUE object ! 
  glue.create();
  glue.add(rVal);
  glue.add(gVal);
  glue.add(bVal);
  glue.endPackage(); // make package and 1.0.1

  payload = glue.get(); // returns message as string 

  publishMqttMessage(myPublishTopic, payload);

}


// create GUI 
function createSendButton(){
  sendButton = createButton('Send Color');
  sendButton.style('font-size', '20px');
  sendButton.style('background-color', "orange");
  sendButton.position(475, 405); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  sendButton.mousePressed(buildColorMessage);
}

function createSliders(){

  // create red selector
  rSlider = createSlider(0, 255, 0); // was 0, 255, 127
  rSlider.position(475, 325);
  rSlider.style("width", "127px");
  rSlider.id("rSlider");

  // create green selector
  gSlider = createSlider(0, 255, 0);
  gSlider.position(475, 350);
  gSlider.style("width", "127px");
  gSlider.id("gSlider");

  // create blue selector
  bSlider = createSlider(0, 255, 0);
  bSlider.position(475, 375);
  bSlider.style("width", "127px");
  bSlider.id("bSlider");
}

