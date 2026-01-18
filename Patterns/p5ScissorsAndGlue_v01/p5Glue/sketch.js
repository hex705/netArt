// scissors and glue ofr js as classes 
// next step get them into a CDN

let glue;


function setup() {

  glue = new p5Glue();

}

function draw() {
 ;
}



function mousePressed(){

  console.clear(); // works in chrome YMMV
  
  // create a message using item by item proceedural function below... 
  let m = createMessageLocal(-12,"hi",34.5);
  console.log(m);

  // creatye a message using function arguements
  let M = glue.createMessage(13,"bye",-65.4,"no",67.8,12);
  console.log(M);

}

// "manual" message creation - echos OSC
function createMessageLocal (first,second,third){

  // send values to arduino
  // glue is a GLUE object ! 
  glue.create();
  glue.add(first);
  glue.add(second);
  glue.add(third);
  glue.end();

  return glue.get(); // returns message as string 

}