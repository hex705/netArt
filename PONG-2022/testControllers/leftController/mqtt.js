
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
    else {
      console.log("*** not yet connected");
    }
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
