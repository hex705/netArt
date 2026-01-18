// a simple pong controller that uses two buttons
// this demo show how to use digital signals to move your paddle

// Remember, you should move OFF your breadboard
// Two buttons are fine, but you need to use your body!

#include <MedianFilter.h>
MedianFilter theFilter(8, 0);

//===================================================
// network library includes

#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- find in secrets.h tab
#include "secrets.h"

//===================================================
// global variable for network -- DO NOT CHANGE
// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);


//*************** PUBLISH TOPICS ********************

/* PLAYER specific variables 

   You need to modify these on game day 
   your <playerPublishTopic> will be:
   p1
  or
   p2

   p1 controls the LEFT paddle
   p2 controls the RIGHT paddle
*/

// **********   mqtt message PUBLISH topics    *******
// String playerPublishTopic = "p1";   // "p1" or "p2" on game day

// for testing use yourname for playerPublishTopic 
 String playerPublishTopic = "stevePongPaddle";   // change subscription on P5JS pong!!!!

String playerName = "digitalSteve"; // your player name - it will be displayed 
String sendMessage = "";


//===================================================
// GLUE and SCISSORS libraries support message protocol
#include <Glue.h>
Glue elmers;


//==++==++==++==++==++==++==++==++==++==++==++==++==
// send timer -- we should listen more than we send
unsigned long sendInterval = 50; //==++ --> affects performance leave near 50 please 
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;


//===================================================
// pong paddlePosition (height)  ... range is 0 == TOP to 255 == BOTTOM of screen 

 int myPosition = 127; // default = middle of screen
int threshold;

//***************************************************
    // YOUR circuit variables -- project specific
    // variables for pins and sensor values etc 

int upButtonPin = A2;  // velostat sensor
int downButtonPin = 5;

int upButtonState = 0;
int downButtonState = 0;


void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream

  pinMode(upButtonPin,INPUT);
  pinMode(downButtonPin,INPUT);

  analogReadResolution(10); // add this for analog readings in ESP32
                            // https://randomnerdtutorials.com/esp32-adc-analog-read-arduino-ide/

  initWiFi();

  if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
    initMqtt();
  }
}

void loop(){
  //Serial.println("loop");
  currentTime = millis();
  mqttClient.poll(); // need to keep Mqtt connection alive

 // when timer expires, take a reading. 
  if ((currentTime - sendStartTime) >= sendInterval){
    readSensors();
    calculatePosition();
     // debugSensors();
    buildControllerMessage(myPosition);
    sendStartTime = currentTime;
  }

}

void readSensors(){

  // this may benefit from edge detection or similar?

  threshold=610;

  upButtonState  = analogRead(upButtonPin);// read velostat

    Serial.print(upButtonState);  // debug for plotter
    Serial.print("\t");

    theFilter.in(upButtonState );  // filter velostat
    upButtonState  = theFilter.out();

    Serial.print(upButtonState);  // plotter again -- this is analog velostat 
    Serial.print("\t");
    Serial.println(threshold);  // debug for plotter
  

  if ( upButtonState > threshold ) { upButtonState = 1; } else { (upButtonState = 0);} // threshold velostat to 0, 1

  downButtonState = digitalRead(downButtonPin);  // 1 or 0 -- simple digital read 

}

void calculatePosition(){

  // we will use the up button to REDUCE  the paddle postion (move it up)
  int SCALE = 10; // every click moves 10 pixels
  
  if ( upButtonState == 1) { // up pressed
      myPosition -= SCALE;
  } 
  if ( downButtonState == 1) { // up pressed
      myPosition += SCALE;
  }


   // keep your paddle on screen 
  if (myPosition <= 0 ) myPosition = 0;
  if (myPosition >= 255) myPosition = 255; 

}

void debugSensors(){
  Serial.print(upButtonState);
  Serial.print("  ");
  Serial.print(downButtonState);
  Serial.println();
}

void buildControllerMessage(int value){
  // use elmers to add the parsing syntax around value -- [*,#]
  elmers.create();
  elmers.add(playerName);
  elmers.add(value);
  elmers.endPackage();
  String payload = elmers.getPackage();

  publishMqttMessage(playerPublishTopic, payload);
}
