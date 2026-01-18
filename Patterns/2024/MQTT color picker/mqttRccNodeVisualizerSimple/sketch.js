/*

some sort of MQTT listener to try and identify errors.

not sure it works the way I want -- no erros seen, but maybe none thrown?

use bot the console and the browser window to watch data

cut and paste so some variable names do not make sense

*/

// MQTT - shiftr 

// PUBLISH TOPIC -- really a sub topic but i did a cut and paste and did not rename everything ....
//let myPublishTopic = "err";
//let payload = "empty";

// we need to sub many devices ... but thats ok
// since they are numbers -- just sub them -- but in array? non-contiguous
var rccNodes = "sensor-Data";
var sdSub = "sensor-Data2";

var newMessage=0;

let elements=[]; // stores incoming mmessage data -- will have node and state

// message protocol variables 
let glue;
let scissors;

let receivedValue = 10;

// drwn bits
let theCanvas;
let n6ElipseFlag = 0;
let anyElipseFlag = 0;

// timer - may not need...
var showInterval = 1000;
var currentTime = 0; 

// node locations -- make this an object once sorted.
var floorplan;
let nodes=[];

// need to solve the numbering of nodes ... this is a bit messy
// [x,y,r,g,b,label];
let  nodeInit =
[
  [0,     0,   0, 0, 0],  // 0  - no node
  [10,  100, 255, 0, 0, '1'],  // 1
  [10,  200, 255, 0, 0, '2'],  // 2
  [10,  300, 255, 0, 0, '3'],  // 3
  [0,     0,   0, 0, 0],  // 4 -- no node
  [10,  400, 255, 0, 0, '5'],  // 5
  [430, 320, 255, 0, 0, '6'],  // 6
  [150, 100, 255, 0, 0, '7'],  // 7
  [0,     0,   0, 0, 0],  // 8   - no node
  [0,     0,   0, 0, 0],  // 9   - no node
  [150, 200, 120, 0, 100, 'sd'],  // 10  - no node -- make it steve for testing
  [0,     0,   0, 0, 0],  // 11  - no node
  [0,     0,   0, 0, 0],  // 12  - no node
  [150, 300, 255, 0, 0, '13']  // 13
]


// floor plan
function preload(){
  floorplan =loadImage("images/RCC_3rdFloor-test.jpg");
}


function setup() {
  // canvas basics
  theCanvas = createCanvas(1200,1600);
  theCanvas.position(20, 100);

  colorMode(RGB, 255);

  //connect to CHANNEL -shiftr- use these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  for (i=0; i<14; i++){
    nodes[i] = new RccNode(nodeInit[i][0],nodeInit[i][1],nodeInit[i][2],nodeInit[i][3],nodeInit[i][4],nodeInit[i][5]);
  }


  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();

  textAlign(CENTER,CENTER);
  ellipseMode(CENTER);
}


// drawing stuff
function draw() {
 // console.log("node " + nodeInit[6]);
  currentTime = millis(); 
  background(255);
  image(floorplan, 0, 40, 800, 600);


   if (newMessage == 1 ) {
     var theNode = elements[1];
     var nodeState = elements[0];

     if (theNode=='sd') theNode = 10;

     nodes[theNode].setDisplayState(nodeState);

     newMessage = 0;
   }

   for (i=0; i<14; i++){
    nodes[i].displayNode();
  }
  
  // show mouse -- useful for placing nodes on map 
  fill(0);
  var x= mouseX;
  var y= mouseY;
  text ("loc " + x + " " + y, 10,10); // 435, 780 - outside bathroom

}




class RccNode{

  constructor(_x,_y,_r,_g,_b,_l){
    console.log('constructor');
    this.x = _x;
    this.y = _y;
 
    this.r = _r;
    this.g = _g;
    this.b = _b;

    this.show = 0;
    this.displayState = 0;
    this.fillColor = color(this.r, this.g, this.b, 80); // 80 is arbitrary transparency.
    this.label = _l;

    this.startTime=0;
    this.radius=20;
    this.step = 1;
  }

  setDisplayState(nodeState){
    this.displayState=nodeState;
    if (nodeState==1){
      this.startTime = millis(); 
    }
  }

  displayNode(){

    if ( this.displayState == 1 ){

    // some sort of time based radius ? experimental
    // note in line 170 displayState=0 turns off node after 1 pulse ... remove to keep pulsing until sensor sends low
      this.radius += this.step;
      if (this.radius >= 80) { this.radius=80; this.step*=-1; }
      if (this.radius <= 18) { this.radius =20; this.step*=-1; this.displayState=0;} // display state allows one pulse
    
      // show the node
      noStroke();
      fill(this.fillColor);
      ellipse(this.x, this.y,this.radius);
      fill(255);
      text(this.label,this.x, this.y);
    }  
  }


} // end class RccNode

