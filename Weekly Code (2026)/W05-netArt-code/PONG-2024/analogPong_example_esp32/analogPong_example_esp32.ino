// a simple pong controller that uses a POT
// you can't use a POT!
// you can use any other analog signal


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

// for GAME DAY you will be left paddle (p1) or RIGHT paddle (p2)
//String playerPublishTopic = "p1";   // "p1" or "p2" on game day

// for testing use yourname for playerPublishTopic 
String playerPublishTopic = "p2";   // change subscription on P5JS pong!!!!

String playerName = "analogSteve"; // your player name - it will be displayed 
String sendMessage=";";

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


//***************************************************
    // YOUR circuit variables -- project specific
    // variables for pins and sensor values etc 

int potPin = A2;
boolean debugMQTTMessage = false;

void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream
  pinMode(potPin, INPUT);
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
        //debugSensors();
    buildControllerMessage(myPosition);
        debugMQTTMessage = true;
    sendStartTime = currentTime;
  }
}

void readSensors(){
  myPosition = analogRead(potPin);//  0-1023
  // Serial.print("raw ::  " ) ;
  // Serial.println(myPosition);
}

void calculatePosition(){
  // could be a simple scaling if you did an analog read  (0-1023) 
  // and need a 0-255 then divide by 4 (/4)
   //myPosition = myPosition/4;

   // could have used a mapping here: 
   myPosition = map ( myPosition, 0,1023,0,255);

// keep your paddle on screen 
  if (myPosition <= 0 ) myPosition = 0;
  if (myPosition >= 255) myPosition = 255; 
}


void debugSensors(){
  Serial.print("calculated ::  " ) ;
  Serial.println(myPosition);
}

void buildControllerMessage(int value){
  // use elmers to add the parsing syntax around value -- [*,#]
  // payload part
  elmers.create();
  elmers.add(playerName);
  elmers.add(value);
  elmers.endPackage();
  String payload = elmers.getPackage();
  // MQTT - topic, payload combined 
  publishMqttMessage(playerPublishTopic, payload);
  
  if (debugMQTTMessage){
    Serial.print(playerPublishTopic);
    Serial.print("\t");
    Serial.println(payload);
  }
}
