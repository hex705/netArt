// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

let theCanvas;
let birdImg;

let flapImg;
let fallImg;
let drawImage;

let drawSize= 200;
let drawX=150, xSpeed=0, oldXSpeed=0;

function preload() {
  flapImg = loadImage('/assets/flappy_1.png');
  fallImg = loadImage('/assets/failing_1.png');

}

function setup() {
  theCanvas = createCanvas(1000, 750);
  imageMode(CENTER);
  drawImage = flapImg;
  frameRate(30);
    console.log("x " + drawX);
}

function draw() {
 background(51, 204, 255); // some bluish color
 changeBirdXSpeed(); // give it some left to right motion
 moveBird();  // animate it
 image(drawImage, drawX, mouseY,drawSize,drawSize);
}

function moveBird(){

  drawX += xSpeed;
  if( drawX > width) drawX = 0;
  if ( drawX < 0) drawX = width;

  console.log("x " + drawX);
}

function changeBirdXSpeed(){
  // pick a number from 1- 100;
  xSpeed = oldXSpeed;
  let x = random(100);
  // if bigger than 80, change speed
  if (x >= 80){
     xSpeed = floor(random(-5, 5));
  }
  oldXSpeed = xSpeed;
  console.log("new x speed " + xSpeed);
}

function keyPressed(){
    drawImage = fallImg;
}

function keyReleased() {
    drawImage = flapImg;
}
