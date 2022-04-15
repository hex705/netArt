// MQTT client:
let mqttClient;

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 443
};

// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES, // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME, //  "instanceName"
  mqttPW: CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};

// topic to subscribe to when you connect:
let publishTopic = "pongGame"; // when pub/sub are same you loopback data
// let subscribeToPlayerOne = "playerOne";
// let subscribeToPlayerTwo = "playerTwo";


// called from setup
function createMQTTClientObject() {
  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname, // url
    Number(broker.port), // port
    creds.clientID // device name
  );
}

//called from setup
function createMQTTConnection() {
  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect, // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true // use SSL
  });
}

// called from setup
function createMQTTClientCallbacks() {
  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMqttMessageArrived;
}


// called when the client connects
function onConnect() {
  console.log("Pong is connected to shiftr");

  // subscribe here :: technically you can subscribe to as many topics as you want
  mqttClient.subscribe(subscribeToPlayerOne);
  mqttClient.subscribe(subscribeToPlayerTwo);
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
    //console.log('topic ' + topic);
    publishMessage.destinationName = topic;
    // send it:
    mqttClient.send(publishMessage);
    // print what you sent:
    //  console.log("sending :: " + publishMessage.payloadString);
  } // end color check
}

// MQTT LISTEN -- called when a message arrives

// NOTES ::  most of this function will be project specific -- you need to know what sort of data is coming in

// to control the bird we need to receive
// -- analogValue from photocell
// -- digitalValue from button
// for demo purposes I decided to use 2 topics rather than bunching these into one message.
// finally, remember -- an MQTT message has a payload and a topic

// function onMqttMessageArrived(message) {
//
//   debugIncomingMessage(message);
//
//   // unpack the payload - its a string of form [*,#] even though one data point per message (just like serial)
//   let currentString = message.payloadString;
//   trim(currentString); // remove white space
//   if (!currentString) return; // if empty
//   latestData = currentString; // for display
//
//   // parse the incoming string to extract data
//   // there will only be an elements[0] at end
//   elements = currentString.slice(1); // remove start byte
//   elements = elements.toString().split(","); // split on commas
//
//   // grab the topic of the current message
//   let theTopic = message.destinationName;
//
//   // if we get a player connection deal with it here
//   if (elements[0]=="CONNECT"){
//     console.log("player connection attempt");
//     if (theTopic == "playerOne"){
//       console.log("p1 attempt");
//       playerOneConnect("CONNECT",0);
//     }
//     if (theTopic == "playerTwo"){
//       console.log("p2 attempt");
//       playerTwo(elements[0],0);
//     }
//   }
//
//     //[*,playerName,controllerType,value,#];
//
//   // we are subscribed to two <topics> -- so we must figure out which topic just spoke
//   switch (theTopic) {
//     case "playerOne":
//        playerIndex = 1;
//        playerType = elements[1];
//        playerMove = elements[2];
//        doSomething();
//       break;
//     case "playerTwo":
//        playerIndex = 2;
//        playerType = elements[1];
//        playerMove = elements[2];
//        doSomething();
//
//       break;
//     default:
//       //  do nothing
//   }
//
// }

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
