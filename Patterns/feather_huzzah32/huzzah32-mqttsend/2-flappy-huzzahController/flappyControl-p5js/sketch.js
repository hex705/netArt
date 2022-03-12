// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

// network variables
let buttonState = 0;
let photoCellState = 127; // halfway (0-255)

// drawing variables
let theCanvas;
let birdImg;

let flapImg;
let fallImg;
let drawImage;

let drawSize = 200;
let drawX = 500,
    xSpeed = 0,
    oldXSpeed = 0;

let drawY = 375; // photocell data replaces mouseY from original (MQTT tab, onMqttMessageArrived)

function preload() {
  flapImg = loadImage('/assets/flappy_1.png');
  fallImg = loadImage('/assets/failing_1.png');
}

function setup() {
  theCanvas = createCanvas(1000, 750);

  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  // image and screen setup
  imageMode(CENTER);
  drawImage = flapImg;
  frameRate(30);
  console.log("x " + drawX);

}

function draw() {
  background(51, 204, 255); // some bluish color
  changeBirdXSpeed(); // give it some left to right motion
  moveBird(); // animate it
  image(drawImage, drawX, drawY, drawSize, drawSize);
}

// move the bird left / right
function moveBird() {
  drawX += xSpeed;
  if (drawX > width) drawX = 0;
  if (drawX < 0) drawX = width;
  //console.log("x " + drawX);
}

// intro some random left/right motion
// this could be much better
function changeBirdXSpeed() {
  // pick a number from 1-100
  xSpeed = oldXSpeed;
  let x = random() * 100;
  // if bigger than 80, change speed
  if (x >= 80) {
    let temp = random() * 10;
    //console.log("temp" + temp);
    xSpeed = floor(map(temp, 0, 10, -5, 5));
  }
  oldXSpeed = xSpeed;
  //console.log("new x speed " + xSpeed);
}


// in base example keyboard input change the image of the bird -- here we will rely on physcial button (MQTT tab, onMqttMessageArrived)

// function keyPressed() {
//   drawImage = fallImg;
// }
//
// function keyReleased() {
//   drawImage = flapImg;
// }
