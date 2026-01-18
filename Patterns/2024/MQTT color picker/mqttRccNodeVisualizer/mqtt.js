// MQTT client:
let mqttClient;


// topic to subscribe to when you connect:
// these variables can also be put in main tab 

// let publishTopic = "somePubTopic"; // when pub/sub are same you loopback data
// let subscribeTopic1 = "sub1";
// let subscribeTopic2 = "sub2";

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 443 // 443, 1883
};


// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES, // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME, //  "instanceName"
  mqttPW: CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};


// called from setup
function connectMQTT(){
  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();
}


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
  console.log("connecting shiftr ... ");
  pongConnectionState = 0;
  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect,     // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true, // use SSL - back to true
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
      mqttClient.subscribe('$events');
      mqttClient.subscribe(n6Sub); // sub to 6
      //mqttClient.subscribe(subscribeTopicTwo);

  console.log("PUBlishing to: \n" + myPublishTopic );

}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
    console.log("shiftr connection lost");
    console.log("will try to reconnect");
  }
}


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
    // when a message arrives you have to PARES (unpack) it 
    // if you are susbscribed to >1 TOPIC, you must also sort which TOPIC arrived 

function onMqttMessageArrived(message) {
    newMessage = 1;

  // PARSE (unpack) the arriving MESSAGE 

  if ( message.destinationName == n6Sub) {
    // parse with scissors

  } else { // may not be able to mix the errors with messages??? 

  }
   
  
 //  debugIncomingMessage(typeof(message));
   var inMessage = JSON.parse(message.payloadString);
   try {
    // hide doorbell when its on 
   if (inMessage.message.topic !== 'doorBell'){

    

       // error check 
      arrivalTime = Date.now();
    //  debugIncomingMessage(message);
      // var inContent= JSON.parse(inMessage.message);
      //temp=message.payloadString[0];
      id = inMessage.id;
      sequence=inMessage.sequence;
      type=inMessage.type;
      mqttMessage=inMessage.message;
      showMessage = JSON.stringify(inMessage.message);
      // try {
      //   img_url = json2.data[0].images['fixed_height_small'].url;
      // } catch (err) {
      //   console.log('no image found for ' + json1.word);
      //   console.error(err);
      // }
      try {
        topic = mqttMessage.topic;
        } catch (err) {
          console.log('err:: no topic ' + err);
        }
      try {
        mqttPayload = atob(inMessage.message.payload); // https://www.digitalocean.com/community/tutorials/how-to-encode-and-decode-strings-with-base64-in-javascript
        } catch (err) {
          console.log('err:: no payload' + err);
        }

        if ( (inMessage.message.topic == n6Sub) || (topic=='sensor-Data') || (topic == 'sensor-Data2') ) {
          console.log('here');
           nodeMessage = 1; 
           // we want to use the n6 message to draw a circle
           // basic parse -- 
           let currentString = mqttPayload;  // this is all the gibberish -- need to do this lower 
           trim(currentString); // remove white space
           if (!currentString) return; // if empty
           latestData = currentString; // for display
         
           // parse the incoming string to extract data
           // there will only be an elements[0] at end
           elements = currentString.slice(1); // remove start byte
           elements = elements.toString().split(","); // split on commas
           return;
   
        }  // node 6 check 
    } // end doorbell check
  }  catch (err) {
    console.log('err:: doorBell topic' + err);
  } // end doorbell try


  // qosinMess  ;

   //retained=;

  // connectionID=''

   currentMessageContent = message.payloadString;

//   // unpack the payload - its a string of form [*,data,data,#]
//   let currentString = message.payloadString;
//   trim(currentString); // remove white space
//   if (!currentString) return; // if empty
//   latestData = currentString; // for display

//   // parse the incoming string to extract data
//   // there will only be an elements[0] at end
//   elements = currentString.slice(1); // remove start byte
//   elements = elements.toString().split(","); // split on commas
//   //console.log(elements[1]);

//  /// ******* IF NEEDED --- sort by topic   ***********
//  //  some of this must be configured manually. 

// // get the topic of the current message
//   let theTopic = message.destinationName;

//   // // we are subscribed to two <topics> -- so we must figure out which topic just spoke
//   // console.log("line 142 in mqtt.js - SORT BY TOPIC define your SUBSCRIBE topics!");
//   // switch (theTopic) {
//   //   case subscribeTopicOne:  // note this topic must match 
//   //     console.log("IN: onMqttMessageArrived, got a TopicOne message");
//   //     // var = elements[0];
//   //     break;
//   //   case subscribeTopicTwo:
//   //     console.log("IN: onMqttMessageArrived, got a TopicTwo message  " );
//   //      // var = elements[0];
//   //     break;
//   //   default:
//   //     //  do nothing
//   // }
} // end message arrived


// look inside an incoming MQTT message
function debugIncomingMessage(m) {
  // mqtt message (m) is an object with 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  
  console.log('\n\n\nmessage received');
  console.log(Date.now());
  console.log('raw message content:: ');
  console.log(m); // look at this in console
  console.log("incoming topic :: " + m.destinationName);
  console.log("incoming payload :: " + m.payloadString);
}
