// message tab

let moveCCW = 1;
let moveCW = 2;
let moveReset = 3; 
let getPosition = 4;


// message builder, specific to this project

function buildCCWMessage(){
      assembleMessage(moveCCW);
}
function buildCWMessage(){
      assembleMessage(moveCW);
}

function buildResetMessage(){
    assembleMessage(moveReset);
}


function buildGetMessage(){
    assembleMessage(getPosition);
}
  
// use glue to build our message 
function assembleMessage (motorMove){
    // send values to arduino
    // glue is a GLUE object ! 
    glue.create();
    glue.add(motorMove);
    glue.endPackage(); // make package and 1.0.1
  
    payload = glue.get(); // returns message as string 
    console.log(payload);
    publishMqttMessage(myPublishTopic, payload);
  
  }