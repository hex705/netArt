// see also :: https://www.youtube.com/watch?v=bkGf4fEHKak&t=180s
// https://github.com/vanevery/p5LiveMedia

// this sketch uses p5 live media for video streaming
// this setup up supports two cameras

// there is an invisible to us broker running in new york that manages streams to rooms.

// rooms are like a shiftr instance but a bit more blunt

// MQTT pub // sub
// PUBLISH TOPIC
let myPublishTopic = "demo_servoControl";
let mySubscribeTopic = "servoPosition";
let payload = "empty";

// message protocol variables 
let glue;
let scissors;
let remoteServoPosition

let  localVideo = null;
let remoteVideo = null; 

let leftButton, rightButton, resetPositionButton, getPositionButton;

let fs;
let fullScreenState = false;


// pip scales
let pipInsetWidth = 200;
let pipInsetHeight = 150;
let pipInsetX = 20;
let pipInsetY = 20;

let pipMainWidth = 800;
let pipMainHeight = 600;
let pipMainX = 20;
let PipMainY = 20;

let pipInsetBorder;

// side by side scales
let sbsWidth = 400;
let sbsHeight = 300;
let sbsX = 20;
let sbsY = 20;

// display variables

let localDisplayWidth, localDisplayHeight, remoteDisplayHeight, remoteDisplayWidth;
let localDisplayX, localDisplayY, remoteDisplayX, remoteDisplayY;

let localDisplayState=1, remoteDisplayState=1;  // show hide fxn 

let SideBySide=0;
let PictureInPicture=1;
let displayState = 0;

let border = 20;

function setup() {

  createCanvas(800+3*border,800+2*border);
  setDisplaySizes();
  textAlign(TOP, LEFT);

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();

  connectMQTT();
  
  let constraints = {audio: false, video: true};
  localVideo = createCapture(constraints, 
    function(stream) {
      let p5lm = new p5LiveMedia(this, "CAPTURE", stream, "servoDemo");  // my name - special number jZQ64AMJc 
      p5lm.on('stream', gotStream);
    }
  );

  localVideo.elt.muted = true;
  localVideo.hide();

 // createAllButtons();
}


function gotStream(stream, id) {
  remoteVideo = stream;
  //remoteVideo.id and id are the same and unique identifier - 
  //console.log("remoteVideo.id:: " + remoteVideo.id);
  console.log("id:: " + id);
  remoteVideo.hide();
}

function draw() {
  background (255);

  setDisplaySizes(); 
  
  if (displayState == PictureInPicture) {
    drawRemote();
    drawLocal();
  } else {
    drawLocal();
    drawRemote();
  }

  fill(200,0,100);
 // ellipse(mouseX,mouseY,50,50);
}


function windowResized() {
  resizeCanvas(windowWidth , windowHeight);
}


function drawLocal(){
  if (localDisplayState == 0) return;
  if (localVideo != null) {
    //tint (255,0,10);
    fill(255);
    noStroke();
    rect(localDisplayX-3,localDisplayY-3,localDisplayWidth+6,localDisplayHeight+6)
    image(localVideo,localDisplayX,localDisplayY,localDisplayWidth,localDisplayHeight); // mouseY was height 
    fill(255,255,255);
    text("Local Video", localDisplayX+5, localDisplayY+15);
  }
}

function drawRemote(){

  if (remoteVideo != null) {
    // tint (255,0,255);
   image(remoteVideo,remoteDisplayX,remoteDisplayY,remoteDisplayWidth,remoteDisplayHeight);
   fill(255,255,255);
   text("Remote Video", remoteDisplayX+5, remoteDisplayY+15); 
   }  

}

function setDisplaySizes(){
   // console.log("displayState = " + displayState);

    switch (displayState) {
      case 0: // SideBySide
        //console.log("in sbs");
        localDisplayWidth = sbsWidth;
        localDisplayHeight = sbsHeight;
        localDisplayX = border;
        localDisplayY = border;
    
        remoteDisplayWidth = sbsWidth;
        remoteDisplayHeight = sbsHeight; 
        remoteDisplayX = width/2+border;
        remoteDisplayY = border;

        localDisplayState =1;

      break;

      case 1: // picture in picture
     // console.log("in pip");
        localDisplayWidth = pipInsetWidth;
        localDisplayHeight = pipInsetHeight;
        localDisplayX = width-border*2-pipInsetWidth;
        localDisplayY = pipMainHeight-pipInsetHeight-border;

        remoteDisplayWidth = pipMainWidth+border;
        remoteDisplayHeight = pipMainHeight;
        remoteDisplayX = border;
        remoteDisplayY = border;
      break;

      default:
        // nothing
    } // end switch
  } // end fxn 



function keyPressed(e){
  if (e.repeat) {return}
  //https://davidwalsh.name/javascript-debounce-function

  if ( key === 'p' || key ==='P'){
    console.log("PIP or SBS");
    displayState= 1-displayState;
    console.log("new displayState = "+ displayState);
  }

  if ( key === 'h' || key ==='H'){
    console.log("hide local");
    localDisplayState = 1 - localDisplayState;
    console.log("localHide = "+ localDisplayState);
  }


 if ( key === 'f' || key ==='F'){

  fs = fullscreen(); // get current screen status
  console.log("screen state before press " + fs);
  fullscreen(!fs);       // change it
  fullScreenState = !fullScreenState;
  if (fullScreenState === true){
    canvas.className = "fullscreen";
  } else {
    canvas.className = "";
  }
  console.log("screen state AFTER press " + fs);
}
}

// create GUI 
//https://editor.p5js.org/kjhollen/sketches/58WL8zYu1
function createAllButtons(){
  leftButton = createButton('Rotate CCW');
  leftButton.style('font-size', '20px');
  leftButton.style('background-color', "LIGHT-BLUE");
  leftButton.position(50, 700); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  leftButton.mousePressed(buildCCWMessage);

  rightButton = createButton('Rotate CW');
  rightButton.style('font-size', '20px', 'color', '#ffffff');
  rightButton.style('background-color', "RED");
  rightButton.position(250, 700); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  rightButton.mousePressed(buildCWMessage);

  resetPositionButton = createButton('Reset Position (middle)');
  resetPositionButton.style('font-size', '20px');
  resetPositionButton.style('background-color', "orange");
  resetPositionButton.position(500, 700); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  resetPositionButton.mousePressed(buildResetMessage);

  getPositionButton = createButton('Get Position');
  getPositionButton.style('font-size', '20px');
  getPositionButton.style('background-color', "green");
  getPositionButton.position(500, 740); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  getPositionButton.mousePressed(buildGetMessage);
}
