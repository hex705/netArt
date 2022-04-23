// serial to mqtt bridge
// bi-directional
// ASSUME ALL NODES USE SAME protocol
//  -- this allows end node to parse and the bridge to simple move strings

//===================================================
// set up environment
let theCanvas;
let serialIndent = 50;
let mqttIndent = 500;

let lastSerialString = "";
let lastMqttString = "";

//===================================================
// serial globals
let serial;
let portName = "/dev/tty.usbmodem142101"; // copy from p5 serial control

//===================================================
// message variables

let mqttOutTopic = "playerOne-sd"; // assuming pong
let mqttSubscribeTopic = "pongGame";
let latestData="";
let elements;
// let newData, xPos,yPos, quadrant, lastQuadrant;


function setup() {

  theCanvas = createCanvas(1100, 200);

  //connect to shiftr these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

  //serial port
  serial = new p5.SerialPort();    // create instance of serialport
  listSerialPorts();               // show ports
  serial.open(portName);           // open a serial port
  createSerialCallbacks();
}


function draw() {
 // nothing here ?
 // visualize the data ?
 background(80);
 // this is a bridge is catches serial
 // and passes mqtt
 //it catches MQTT anad passes to serial
 fill(255);
 textSize(22);

 text ("serial",serialIndent,50);
 text("mqtt",mqttIndent,50);

 text(serialInString, serialIndent+10, 100);
  text(mqttOutTopic, mqttIndent, 100);
    text(mqttOutPayload, mqttIndent+200, 100);

}
