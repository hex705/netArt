// controller message structure
// topic playerOne (left side)
// topic playerTwo (rightSide)

//  '*' +myName+',' + controllerValue + ',#'


let myName = "sasquatch simpson";
let controllerType = "ANALOG"; // leave this for now
let publishTopic = "playerTwo";

// MQTT client:
let mqttClient;

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // paste URL from token, put in quotes
  port: 443
};

// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES,    // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME,    //  "instanceName"
  mqttPW:   CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};

// topic to subscribe to when you connect:

let subscribeTopic = "pongGame"; //out of the box this loops back

function setup() {
  // canvas basics
  cnv = createCanvas(100,512);
  cnv.position(250, 0);
  colorMode(RGB, 255);

  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname,     // url
    Number(broker.port), // port
    creds.clientID       // device name
  );

  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect, // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true // use SSL
  });

  while ( !mqttClient.isConnected){console.log(".");}
  console.log("connected to shiftr");

  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost; // subscribe here
  mqttClient.onMessageArrived = onMessageArrived;

  // graphical elements
  inColor = color(50,150,255);
  myColor = color(100,10,127);
  sendColor = color(0,0,255);

 console.log("trying to connect player");
  connectToGame();
}

function connectToGame(){
  let package = "*CONNECT,#";
  publishMqttMessage(publishTopic, package);
  console.log("connecting to game");
}

// message builder, specific to this project
function buildControllerMessage(controllerValue){
  // check for error in color
  if ( isNaN(controllerValue)) {
    console.log ( 'malformed message');
  } else {
    // good message send it to shiftr
    // original
       //  let package = String( '*' +myName+ ',' + controllerType + ',' + controllerValue + ',#');
    // simplified
    let package = String( '*' +myName+',' + controllerValue + ',#');
    publishMqttMessage(publishTopic,package);
  }
}

function mouseDragged(){
  buildControllerMessage(floor(mouseY % 255));
}

function keyPressed(e) {
  if (e.repeat) {return}
 if (key=='c' || key == 'C'){
    let package = "*CONNECT,#";
    publishMqttMessage(publishTopic, package);
 }
}

// drawing stuff

function draw() {

  background(100,0,80);
  rect(45,mouseY,10,75);
}
