
let myName = "steve";
let controllerType = "ANALOG"; // leave this for now
let publishTopic = "playerOne";

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
  mqttUser: INSTANCE_OR_USER_NAME,            //  "instanceName"
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

  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost; // subscribe here
  mqttClient.onMessageArrived = onMessageArrived;

  // graphical elements
  inColor = color(50,150,255);
  myColor = color(100,10,127);
  sendColor = color(0,0,255);
}

// called when the client connects
function onConnect() {
  console.log("client is connected");
  mqttClient.subscribe(subscribeTopic);
  // technically you can subscribe to as many topics as you want
  // this code is set up for one subscription
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
  }
}

// MQTT LISTEN -- called when a message arrives
function onMessageArrived(message) {

  debugIncomingMessage(message);

  // unpack the message - its a string of form [*,#]
  let currentString = message.payloadString;
  trim(currentString); // remove white space
  if (!currentString) return; // if empty
  latestData = currentString; // for display

  // parse the incoming string into elements
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas
      console.log('elements array');
      console.log(elements);

  // // SPECIFIC FOR SENDING COLORS
  // //  error check -- I was getting lots of NaN at one point
  // if ( isNaN(elements[0]) || isNaN(elements[1]) || isNaN(elements[2])){ // r=='NaN' fails quitely -- oops
  //   console.log('received malformed package');
  // } else {
  //   inColor = color(elements[0], elements[1],elements[2]);
  // }
}





// MQTT TALK -- called when you want to send a message:
function publishMqttMessage(topic,package) {

  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {

      package = String(package);
      let publishMessage = new Paho.MQTT.Message(package);
      // choose the destination topic:
      console.log('topic '+topic);
      publishMessage.destinationName = topic;
      // send it:
      mqttClient.send(publishMessage);
      // print what you sent:
      console.log("sending :: " + publishMessage.payloadString);
    } // end color check
}

// look inside an incoming MQTT message
function debugIncomingMessage(m){
  // mqtt message (m) is an object with 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  console.log('message received');
  console.log('raw message :: ');
  console.log(m); // look at this in console
  console.log("incomming topic :: " + m.destinationName);
  console.log("incomming payload :: " + m.payloadString);
}

// message builder, specific to this project
function buildControllerMessage(controllerValue){
  // check for error in color
  if ( isNaN(controllerValue)) {
    console.log ( 'malformed message');
  } else {
    // good message send it to shiftr
    let package = String( '*' +myName+ ',' + controllerType + ',' + controllerValue + ',#');
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
