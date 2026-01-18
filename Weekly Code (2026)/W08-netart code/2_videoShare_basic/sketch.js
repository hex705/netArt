// see also :: https://www.youtube.com/watch?v=bkGf4fEHKak&t=180s


// https://github.com/vanevery/p5LiveMedia


let myVideo = null;

function setup() {
  createCanvas(800,400);
  
  let constraints = {audio: false, video: true};

  // your local video and connection to live media server ( broker) 
  myVideo = createCapture(constraints, 
    function(stream) {
      let p5lm = new p5LiveMedia(this, "CAPTURE", stream, "squid");  // my name - special number jZQ64AMJc 
      p5lm.on('stream', gotStream);
    }
  );

  myVideo.elt.muted = true;
  myVideo.hide(); 
}


// call back -- if another stream connects to you 
let otherVideo;

function gotStream(stream, id) {
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifier
  otherVideo.hide();
}

// show the two videos
function draw() {
  background (255);
  // your local video 
  if (myVideo != null) {
    fill(255,255,255);
    text("My Video", 10, 10);
    //tint (255,0,10);
    image(myVideo,0,0,width/2,height); // mouseY was height 
    
  }

  // remote video if there is one. 
  if (otherVideo != null) {
    fill(255,255,255);
    text("Their Video", width/2+10, 10);

   // tint (255,0,255);
    image(otherVideo,width/2,0,width/2,height);
  
  }  
  ellipse(mouseX,mouseY,50,50);
}





