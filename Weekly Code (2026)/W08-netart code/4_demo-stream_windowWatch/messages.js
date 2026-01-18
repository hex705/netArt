// message tab

let moveLeft = 10;
let moveRight = 20;
let moveReset = 30; 
let getPosition = 40;


// message builder, specific to this project

function buildLeftMessage(){
      assembleMessage(moveLeft);
}
function buildRightMessage(){
      assembleMessage(moveRight);
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