// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

let theCanvas;
let count = 0;

let sendInterval;

function setup() {
  theCanvas = createCanvas(255, 255);
  //theCanvas.position(0,0);

  //connect to shiftr (mqtt.js)
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

sendInterval = setInterval(buildMqttMessages, 4000);

}

function draw() {
 background(0);
 fill(0,255,0);
 ellipse(mouseX,mouseY,25,25);
}

function buildMqttMessages(){
  count++;
  let m1 = String("*"+count+','+ (count+10)+',#');
  publishMqttMessage("one", m1);

  let m2 = String("*75,100,#");
  publishMqttMessage("two", m2);
}
