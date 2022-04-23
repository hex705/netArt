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
let publishTopic = "MY-PUBLISH-TOPIC"; // when pub/sub are same you loopback data
let subscribeTopic_1 = "TOPIC_1";
let subscribeTopic_2 = "TOPIC_2";


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
  mqttClient.onConnectionLost = connectionLost;
  mqttClient.onMessageArrived = mqttMessageArrived;
}


// called when the client connects
function onConnect() {
  console.log("client is connected");

  // subscribe here :: technically you can subscribe to as many topics as you want
  mqttClient.subscribe(mqttSubscribeTopic);
  // more subscriptions here
}


// called when the client loses its connection
function connectionLost(response) {
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

// NOTES ::  most of this function will be project specific -- you need to know what sort of data is coming in

// to control the bird we need to receive
// -- analogValue from photocell
// -- digitalValue from button
// for demo purposes I decided to use 2 topics rather than bunching these into one message.
// finally, remember -- an MQTT message has a payload and a topic

function mqttMessageArrived(message) {

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

  // at this point all incommming data is in global elements[]

  // grab the topic of the current message
  let theTopic = message.destinationName;

  // we are subscribed to two <topics> -- so we must figure out which topic just spoke
  switch (theTopic) {
    case "photoCell":
      photoCellState = elements[0];
      console.log("got photocell message " + photoCellState );
      // map the phootocell to canvas height
      drawY = map(photoCellState, 0, 1023, height, 0);
      break;
    case "button":
      buttonState = elements[0];
      console.log("button message " + buttonState);
      // select which version of bird to draw
      if (buttonState == 0) { // button not pressed
        drawImage = flapImg;
      } else {
        drawImage = fallImg;
      }
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
