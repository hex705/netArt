let canvas;

function setup() {
  // canvas basics
  canvas = createCanvas(500,500);
}

function draw(){
  background(100);
  fill(255,0,100);
  ellipse(mouseX, mouseY, 25,25);
}
