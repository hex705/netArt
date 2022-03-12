// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

let theCanvas;

function setup() {
  theCanvas = createCanvas(255, 255);
  //theCanvas.position(0,0);
}

function draw() {
 background(0);
 fill(0,255,0);
 ellipse(mouseX,mouseY,25,25);
}
