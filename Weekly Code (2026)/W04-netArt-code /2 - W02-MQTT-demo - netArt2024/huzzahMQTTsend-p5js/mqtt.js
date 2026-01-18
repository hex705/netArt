// MQTT client:
let mqttClient;

// topic to subscribe to when you connect:
// these topics control who gets a message. 
let subscribeToPotTopic = "a_potState";
let subscribeToButtonTopic = "a_buttonState";

//let publishTopic = "MY-PUBLISH-TOPIC"; // when pub/sub are same you loopback data


// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 443
};

// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES, // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME, // "instanceName"
  mqttPW: CHECK_DtwoL_FOR_MQTT_KEY //  secret - from token
};

// called from setup
function connectMQTT(){
  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();
}



// create the MQTT client object 
function createMQTTClientObject() {
  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname, // url
    Number(broker.port), // port
    creds.clientID // device name
  );
}

// called from setup
// try to connect to shiftr
function createMQTTConnection() {
  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect, // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true, // use SSL
    onFailure: onFailedConnection
  });
}

// called from setup
// utility functions to maintian connection 
function createMQTTClientCallbacks() {
  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMqttMessageArrived;  // p5js listens for MQTT
}

// called if SHIFTR connection fails:
function onFailedConnection(){
  console.log(" !! shiftr failed to connect - \n !! check secrets.js");
}

// called when the client connects
// actions to take when we get connected to shiftr
function onConnect() {
  console.log("client is connected to shiftr (MQTT)! @\n" + broker.hostname);

  // subscribe here :: technically you can subscribe to as many topics as you want
  mqttClient.subscribe(subscribeToPotTopic);
  mqttClient.subscribe(subscribeToButtonTopic);
  console.log("client subscribed to : " + subscribeToPotTopic);
  console.log("client subscribed to : " + subscribeToButtonTopic);
}


// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
  }
}

// we don't actually talk in this example
// MQTT TALK -- called when you want to send a message:
function publishMqttMessage(topic, package) {

  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {

    package = String(package);
    let publishMessage = new Paho.MQTT.Message(package);
    // choose the destination topic:
    console.log('topic ' + topic);
    publishMessage.destinationName = topic;
    // send it:
    mqttClient.send(publishMessage);
    // print what you sent:
    console.log("sending :: " + publishMessage.payloadString);
  } // end color check
}



// MQTT LISTEN -- called when a message arrives

// NOTES ::  most of this function will be project specific
//           you need to know what sort of data is coming in!

// to control the rectangles on screen
// -- analogValue from pot ---> height of left rectangle
// -- digitalValue from button   ---> switch square to ball 

// for demo purposes I decided to use 2 topics rather than bunching these into one message.
// finally, remember -- an MQTT message has a payload and a topic

function onMqttMessageArrived(message) {

  debugIncomingMessage(message);

  // unpack the payload - its a string of form [*,#] even though one data point per message (just like serial)
  let currentString = message.payloadString;
  trim(currentString); // remove white space
  if (!currentString) return; // if empty
  latestData = currentString; // for display

  // parse the incoming string to extract data
  // there will only be an elements[0] at end
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas

  // grab the topic of the current message
  let theTopic = message.destinationName;


  // we are subscribed to two <topics> -- so we must figure out which topic just spoke
  switch (theTopic) {
    case subscribeToPotTopic: // "a_potState":
      potState = elements[0];
      console.log("got pot message " + potState );
      break;
    case subscribeToButtonTopic:
      buttonState = elements[0];
      console.log("button message " + buttonState);
      break;
    default:
      //  do nothing
  }

}

// look inside an incoming MQTT message
function debugIncomingMessage(m) {
  // mqtt message (m) is an object with 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  console.log('message received');
  console.log('raw message :: ');
  console.log(m); // look at this in console
  console.log("incomming topic :: " + m.destinationName);
  console.log("incomming payload :: " + m.payloadString);
}
