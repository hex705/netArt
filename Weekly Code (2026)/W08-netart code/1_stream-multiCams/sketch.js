// see also :: https://www.youtube.com/watch?v=bkGf4fEHKak&t=180s

//https://github.com/vanevery/p5LiveMedia

// multistream display 
// could be enhances with reduce display size as number
// of streams grows -- but changing size greatly reduced speeds.
// left all streams at 400x300

let localVideo = null;

// array of streams
let remoteStreams = [];
streamIndex = 0;

let displayWidth, displayHeight;

let vidWidth = 400, vidHeight = 300; 
let border = 15;
let maxCols = 2;  // initital number of cols 
let thisRow, thisCol;

let canvasHeight = 500;
let canvasWidth = vidWidth*3+border*4;

let streamPosition = {
  'x':border,
  'y':border
};

function setup() {

  createCanvas(canvasWidth, canvasHeight);
  
  let constraints = {audio: false, video: true};
  localVideo = createCapture(constraints, 
    function(stream) {
      let p5lm = new p5LiveMedia(this, "CAPTURE", stream, "rabies");  // my name - special number jZQ64AMJc 
      p5lm.on('stream', gotStream);
      p5lm.on('disconnect', gotDisconnect);
    }
  );
  
  localVideo.elt.muted = true;
  localVideo.hide();
}


// add new stream to the display array - remoteStreams
function gotStream(stream, id) {
  //console.log("adding a stream:: " + id);
  remoteStreams[streamIndex]= new RemoteVideoStream(stream, vidWidth, vidHeight, id);
  streamIndex++;

  // add to canvas if we add images
  if (streamIndex == 1 || streamIndex >= maxCols){  // going to leave this 
    canvasHeight+= vidHeight+border;
    resizeCanvas(canvasWidth, canvasHeight);
  }
}

// remove disconnected streams from the display array - remoteStreams
function gotDisconnect(id) {
  console.log("disconnect "+ id);
  let end = streamIndex-1;
  for (let r = end; r >=0; r--){
    // found the disconnected stream - remove it
    if (remoteStreams[r].id == id){
          //console.log ("removing stream " + r + " with id = "+ id);
         remoteStreams.splice(r,1);
         streamIndex--;
         if ( streamIndex < 5) maxCols = 2; // reduce display width as needed. 
    }
  }
}


function draw() {
  background (255);

  // this machines camera stream
  if (localVideo != null) {
    fill(255,255,255);
    text("My Video", 10, 10);
    //tint (255,0,10);
    image(localVideo,border,border,600,450); // mouseY was height 

  }

  if (streamIndex >=5)  maxCols = 3;

  // remote streams
  for (let i = 0; i < remoteStreams.length; i++){
    // https://processing.org/tutorials/pixels
    // let loc = x + y*img.width;  

    // for each steam, calc its position (x,y)
    thisRow = floor(i / maxCols); // floor rounds down (cuts of any fraction == int)
    thisCol = i % maxCols;
    //displayX, displayY
    streamPosition.x= (thisCol * vidWidth)  + border + thisCol*border;
    streamPosition.y= (thisRow * vidHeight) + border + border*thisRow + 500;
    remoteStreams[i].show(streamPosition);
    
    // display index 
    fill(255,255,255);
    text(i, streamPosition.x+10, streamPosition.y+15);
  }
  
  
 // ellipse(mouseX,mouseY,50,50);
}





