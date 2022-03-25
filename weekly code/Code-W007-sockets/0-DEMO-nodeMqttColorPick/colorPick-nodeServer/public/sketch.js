/*

p5js - node (socket.io) - shiftr (mqtt) - huzzah32 (uC)

3 sliders select RGB values

the values are then sent via node /

created for netArt by hex705 (steve daniels) , Feb 2022

*/

let client;
let socket;

// topic to subscribe to when you connect:
let socketTopic   = "sliderData";  // when pub/sub are same you loopback data



let theCanvas;
let latestData="";
let elements;
let theData;

function setup() {
  // canvas basics
  cnv = createCanvas(1000,750);
  cnv.position(20, 100);
  colorMode(RGB, 255);

  // connect to server with socket io
  socket = io.connect();

  // not listening at browser level
  //socket.on("sliderData", handle_sliderData);

  // graphical elements
  myColor = color(100,10,127);
  createSliders();
  createSendButton();

}


// keeping the web interface context seperate from the actual send
// this will come form sliders -- see color build below
// JSON or basic ?

function formatMessage() {
  messageToSend = input.value().toString();
  console.log(typeof messageToSend);
  // update page with what you are sending
  rawContent.html("Raw message to send : " + messageToSend);
  input.value(""); // clear input box

  // if need to send raw -- but we will send JSON
  //package = '*'+messageToSend + '#'; // add start and end bytes for ard parse

  Package = parseInt(messageToSend); // input string to number
  console.log(Package);
  packageContent.html("Formatted Package : " + Package);
  socketSend("sliderData", Package);
}

// socket.io send message

function socketSend(theTopic, stringToSend) {
  console.log("socket :: sending string ", stringToSend);
  // this is from browser to server
  // var payload = {
  //   idOrOther: 1,
  //   str: stringToSend
  // };
  // send the message to the server -- event c(sh)ould match pub/sub topics
  socket.emit(theTopic, stringToSend); // event name, data
}


// message builder, specific to this project
function buildColorMessage(){
  // get color channels
  let r = floor(red(myColor));
  let g = floor(green(myColor));
  let b = floor(blue(myColor));
    // console.log('r '+r);
    // console.log('g '+g);
    // console.log('b '+b);

  // check for error in color
  if ( isNaN(r) || isNaN(g) || isNaN(b)){
    console.log ( 'malformed message');
  } else {
    // good message send it to shiftr
    theData = {
      red:   r,
      green: g,
      blue:  b
    }
  //  let package = String( '*' + r +',' + g + ',' + b + ',#');
    socketSend(socketTopic, theData);
  }
}


// drawing stuff
function draw() {
  background(255);
  drawScreen();
}

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
  rSlider = createSlider(0, 255, 127);
  rSlider.position(475, 325);
  rSlider.style("width", "127px");
  rSlider.id("rSlider");

  // create green selector
  gSlider = createSlider(0, 255, 127);
  gSlider.position(475, 350);
  gSlider.style("width", "127px");
  gSlider.id("gSlider");

  // create blue selector
  bSlider = createSlider(0, 255, 127);
  bSlider.position(475, 375);
  bSlider.style("width", "127px");
  bSlider.id("bSlider");
}

function drawScreen(){

  let topSpacer = 35;
  let sideSpacer = 25;
  let base = 300;


  // choose
  myColor = color(rValue, gValue,bValue);
  fill(myColor);
  rect(sideSpacer,topSpacer,base,base);

  // interface labels
  fill(87,87,87);
  textSize(32);
  text('choose a color ',sideSpacer,30);

  // chose slider labels
  textSize(17);
  text('Red    ('+rSlider.value()+')',350,240);
  text('Green ('+gSlider.value()+')',350,265);
  text('Blue    ('+bSlider.value()+')',350,290);


}

// generic way of tracking all the sliders
// not a very JS solution but it works.
function mouseReleased() {
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();
}


// graphical elements
let myColor;
let rSlider, rValue, gSlider, gValue, bSlider, bValue;
let receivedValue = 10;
let cnv,sendButton;
