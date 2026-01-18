// base project
// sets up a canvas, displays it in html

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
