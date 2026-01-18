// MQTT client:
let mqttClient;

// topic to subscribe to when you connect:
let publishTopic = "pongGame"; // when pub/sub are same you loopback data
// let subscribeToPlayerOne = "playerOne";
// let subscribeToPlayerTwo = "playerTwo";

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 1884   // must be 1884 
};


// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES, // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME, // "instanceName"
  mqttPW: CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};

// called from setup
function connectMQTT(){
  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();
}

// called above
// http://www.steves-internet-guide.com/using-javascript-mqtt-client-websockets/
// https://www.hivemq.com/article/mqtt-client-library-encyclopedia-paho-js/
function createMQTTClientObject() {
  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname, // url
    Number(broker.port), // port  removed a ,
    creds.clientID // device name
  );
}


//called above
function createMQTTConnection() {
  console.log("connecting shiftr ... ");
  pongConnectionState = 0;
  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect,     // callback function for when you connect
    //userName: creds.mqttUser, // username
    //password: creds.mqttPW, // password
    useSSL: false, // must be false -- no certificate 
    onFailure: onFailedConnection
  });

}

function createMQTTClientCallbacks() {
  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMqttMessageArrived;
}

// called if SHIFTR connection fails:
function onFailedConnection(){
  console.log(" !! shiftr failed to connect - \n !! check secrets.js");
}

// called when the client connects
function onConnect() {
  console.log("connected to shiftr @ \n" + broker.hostname ); // you get here when shiftr connection is ok

  // subscribe here :: technically you can subscribe to as many topics as you want
  mqttClient.subscribe(subscribeToPlayerOne);
  mqttClient.subscribe(subscribeToPlayerTwo);

  console.log("PONG subscribed to: \n-" + subscribeToPlayerOne + "\n-" + subscribeToPlayerTwo);

}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
    console.log("shiftr connection lost");
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


function onMqttMessageArrived(message) {

    debugIncomingMessage(message);

  // unpack the payload - its a string of form [*,data,data,#]
  let currentString = message.payloadString;
  trim(currentString); // remove white space
  if (!currentString) return; // if empty
  latestData = currentString; // for display

  // parse the incoming string to extract data
  // there will only be an elements[0] at end
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas
  //console.log(elements[1]);


  // grab the topic of the current message
  let theTopic = message.destinationName;

// remove the connect message structure entirely
// simplify this
  if( STATE == AWAIT_PLAYERS) {
    if (theTopic == subscribeToPlayerOne){
      if (!p.players[1].getConnectionStatus()){
        // if false, not connected yet
        console.log("playerONE trying to connect");
        playerConnect(elements[1],elements[0],1);
      }
    }
    if (theTopic == subscribeToPlayerTwo){
      if (!p.players[2].getConnectionStatus()){
        // not connected yet
        console.log("playerTWO not yet connected");
        playerConnect(elements[1],elements[0],2);
      }
    }
  } // await players


    //[*,playerName,controllerType,value,#];

  // we are subscribed to two <topics> -- so we must figure out which topic just spoke
  switch (theTopic) {
    case subscribeToPlayerOne:
       playerIndex = 1;
       //playerName = elements[0];
       playerMove = elements[1];
       p.players[1].movePaddle(playerMove);
      break;
    case subscribeToPlayerTwo:
       playerIndex = 2;
       //playerName = elements[0];
       playerMove = elements[1];
       p.players[2].movePaddle(playerMove);
      break;
    default:
      //  do nothing
      break;
  }
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
