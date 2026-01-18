// uses MQTT to connect to shiftr.io (public)
// received message from huzzah (esp32) also connected to shiftr.io (public)
// 

// network variables
let buttonState = 0;
let photoCellState = 127; // halfway (0-255)

// drawing variables
let theCanvas;

let drawSize = 250;
let drawY = 375; // horizontal position of green dot

function setup() {
  theCanvas = createCanvas(1000, 750);

  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  // image and screen setup
  frameRate(30);
  ellipseMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(0);

  // map the photocell to canvas height - draw ellipse
  fill(0,200,0);
  drawY = map(photoCellState, 0, 1023, height, 0);
  ellipse(250, drawY, drawSize, drawSize);

  // use button read to determine drawing
  if ( buttonState == 0 ){
    fill(255,0,0);
    rect(750,height/2,drawSize,drawSize);
  } else {   // yellow circle
    fill(200,200,0);
    ellipse(750,height/2,drawSize,drawSize);
  }
}
