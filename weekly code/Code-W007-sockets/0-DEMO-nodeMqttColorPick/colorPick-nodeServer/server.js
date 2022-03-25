// https://www.youtube.com/watch?v=wxbQP1LMZsw


// ********************************************************
// a very simple express Server
// listens on port 3000
// serves static files from folder (directory) public
// ********************************************************

let express = require("express");  // import
let app = express();               // instantiate
app.use(express.static('public')); // folder name of web files

let server = app.listen(3000, ()=> { //activate
  console.log('listening on 3000')
 });

// error check for the static file server
app.on('error', (error)=>{
  console.log('app err:: ',error);
})

// ********************************************************
//  socket component of the project -- use socket.io
//  sockets are HTPP upgrades so we need to have an HTTP server
//  your version of socket io must match server / client (browser - html)
// ********************************************************

// basic html server
//const http = require('http');
//const server = http.createServer(app); // references app above

// socket upgrade to socket.io
var socket = require('socket.io');
var io = socket( server );

io.sockets.on("connection", newConnection);

function newConnection(socket) {
  // set up event handlers for messages FROM WEB clients

  console.log('connection from ', socket.id);


  //socket.on('message', handleRawMessage);

  socket.on('error', handleIOSocketError);
  socket.on("sliderData", handleNewColors); // eventType, fxn

  function handleIOSocketError(e){
    console.log('ioErr ',e);
  }


  // call back for EACH topic subscribed -- this is for topic1
  function handleNewColors(data) {
    console.log("Node server handleNewColors:: ", data);

    // // can use this to send WEB CLIENT message all the other WEB clients -- but not the source ::
    // socket.broadcast.emit("topic1_s", data);
    // // alt ::  send to all clients including echo to source
    // // io.sockets.emit('mouse',data);

    let shiftrMessage = String('*' + data.red + ',' + data.green + ',' + data.blue + ',#');

     mqttSend("RGB-color", shiftrMessage); // change topic for mqtt
    //
    // //console.log(data);
  }

  socket.on("disconnect", function() {
    // do stuff when web client leaves
    console.log('disconnect ', socket.id);
  });
}


// ********************************************************
//  MQTT connection from node to shiftr
//  this is the IOT / device bridge
// ********************************************************
const mqtt = require("mqtt");

// gonna have to just try all of these ?

//let mqttClient = mqtt.connect(process.env.SHIFTR_URL, {
// let mqttClient = mqtt.connect(process.env.VAL898SHIFTR_URL, {
// let mqttClient = mqtt.connect(process.env.steveShiftrURL, {
let mqttClient = mqtt.connect('mqtt://public.cloud.shiftr.io',{
  username : 'public',
  password : 'public',
  clientId: "z-nodeServer"
});


// event handles for connect to shiftr and message received
mqttClient.on("connect", mqttConnect);
mqttClient.on("message", mqttMessageEvent); // message is generic handler

function mqttConnect(e) {
  console.log("connected to shiftr!");

// speaking only server ? maybe add reset button ?

  // mqttClient.subscribe(""); // subscribe to published topics
  // mqttClient.subscribe("accY");
  // mqttClient.subscribe("accZ");
  // mqttClient.subscribe("allAcc");

}

// messages from MQTT clients (other uCs)
function mqttMessageEvent(topic, message) {
  // need topic routing here as required by project
  console.log( "in mqttMessageEvent --> topic : " + topic + " -- message! : " + message);
}


// this fxn takes WEB client data and PUBLISHES it to shiftr for physical clients ( arduinos )
function mqttSend(theTopic, messageToSend) {

  console.log("shiftr topic " + theTopic + " messageToSend ", messageToSend);

  // let s = JSON.stringify(data); // https://stackoverflow.com/questions/4162749/convert-js-object-to-json-string
  //console.log('server mqttSend ' + s);

  //let stringMessage = JSON.stringify(messageToSend); // MQTT needs string
//  printWithType(stringMessage);

  // // package to arduinos
  //     let package =  '*'+tID+','+tX+','+tY+','+tZ+'#';
  //     let messageToSend = String(package);
  //     mqttClient.publish("RGB-color", messageToSend);
  //   }

    mqttClient.publish(theTopic, messageToSend); // topic, data
}
