/*

some sort of MQTT listener to try and identify errors.

not sure it works the way I want -- no erros seen, but maybe none thrown?

use bot the console and the browser window to watch data

cut and paste so some variable names do not make sense

*/

// MQTT - shiftr 

// PUBLISH TOPIC -- really a sub topic but i did a cut and paste and did not rename everything ....
let myPublishTopic = "err";
let payload = "empty";



// message protocol variables 
let glue;
let scissors;

let receivedValue = 10;


// drwn bits
let theCanvas


//variables being used
//{"id":"E2003572","sequence":1724434163582855214,"type":"published","message":{"topic":"sensor-Data2","payload":"KjAsc2QsIw==","qos":0,"retained":false,"connection_id":"C14112"}}

let currentMessageContent;
let id,sequence,type,mqttMessage, topic,mqttPayload,qos,retained, connectionID, showMessage;
let errString = 'not yet ';

let motionCount=0, sensorDataCount=0, sensorData2Count = 0, motorCount=0,errCount =0;
let oldTopic="";
var newMessage = 0; 
var arrivalTime;

function setup() {
  // canvas basics
  theCanvas = createCanvas(1000,800);
  theCanvas.position(20, 100);
  colorMode(RGB, 255);

  //connect to CHANNEL -shiftr- use these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  // scissors and glue -- parsing and assembling messages 
  glue = new p5Glue();
  scissors = new p5Scissors();

}


// drawing stuff
function draw() {
  background(255);
  fill(0);
    // raw message on screen 
  text(currentMessageContent,10,10);


   // parse the whole error messge -- it is in JSON format so scissors is useless here
   // most of the parsing effort is in MQTT tab -- this is just display 

  // console.log(typeof(currentMessageContent)); // its a string 
  // {"id":"E2003572","sequence":1724434163582855214,"type":"published","message":{"topic":"sensor-Data2","payload":"KjAsc2QsIw==","qos":0,"retained":false,"connection_id":"C14112"}}
  fill(50,200,180);
  text("arrival time (not logged yet) : " + arrivalTime ,10,80,500);
  fill(0);
  text("id: " + id,10,100,500);
  text("sequence: " +sequence,15,120,500);

  // the thing we really want to see.
  if (type =='errored'){
    fill(255,0,0); // probably not the right place, added below in switch
    errString += "\nDate.now()\n"+showMessage;
    errCount+=1;
  }

  text("type: " + type,15,140,500);
  text("payload: " + showMessage,30,160,500);

    switch (topic) {
      case 'status-update'  :
        fill(200,0,200);
   
        break;
      case 'motion-Data'  :
        fill(0,200,200);
   
        break; 
      case 'sensor-Data':
        fill(50,150,100);
   
        break;
      case 'sensor-Data2': // my test topic - ionly active if my node is live.
        fill(200,150,0);

        break;
      case 'motor-Data':
        fill(0,0,200);
  
        break;
      case 'errored':
        fill(255,0,0);
  
        break;
      // the default case 
      default:
        fill(0);
        break;
    } // end the switch
  
  
  text("topic: " +topic,50,200,500);
  text("mqttPayload: " +mqttPayload,50,220,500);

  // lazy fix for count -- when blended with switch above it didn't do what I want -- this should be cleaned.
 // if (oldTopic != topic){  <--this was so inadequate
  if ( newMessage == 1){  //set in MQTT received
    console.log("old topic  " + oldTopic);
    console.log("topic  " + topic);
    switch (topic) {
      case 'motion-Data'  :
        motionCount+=1;
        break; 
        
      case 'sensor-Data':
        sensorDataCount+=1;
        break;

      case 'sensor-Data2':
        sensorData2Count+=1;
        break;

      case 'motor-Data':
        motorCount+=1;
        break;
        // the default case 
      default:
      
        break;
    } // end the switch
   //} // end topic change if
  } // end new message


   fill(0);
   text("motion count " + motionCount, 15,300);
   text("motor count " + motorCount, 15,320);
   text("sensor data " + sensorDataCount, 15,340);
   text("sensor data2 " + sensorData2Count, 15,360);

   text("errors: "+errCount+" " +errString,15,400,300);
  oldTopic = topic;
  newMessage = 0; 
  //drawScreen();
}
