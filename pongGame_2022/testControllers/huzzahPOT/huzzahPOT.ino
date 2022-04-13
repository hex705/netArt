
#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// ******     sensor variables    ******************
int myPosition = 127;
int potPin = A7;

// wifi and mqtt clients  **************************
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt message topics (labels)   ***************************
String playerTopic = "playerOne";  // your topics (you can have many)
String playerName = "steve";
String sendMessage="";

#include <Glue.h>
Glue elmers;

// send timer -- we should listen more than we send
unsigned long sendInterval =  50; // 20 per second 
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;

void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream
  analogReadResolution(10);

  initWiFi();

  if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
    initMqtt();
  }
}

void loop(){
  //Serial.println("loop");
  currentTime = millis();
  mqttClient.poll(); // need to keep Mqtt connection alive

  if ((currentTime - sendStartTime) >= sendInterval){
    readSensors();
    // calculatePosition();
    // debugSensors();
    buildControllerMessage(myPosition);
    sendStartTime = currentTime;
  }

}

void readSensors(){
  myPosition = analogRead(potPin)/4;
  Serial.println(myPosition);
}

void calculatePosition(){
  // not needed here
}


void debugSensors(){
  Serial.println(myPosition);
}

void buildControllerMessage(int value){
  // use elmers to add the parsing syntax around value -- [*,#]
  elmers.create();
  elmers.add(playerName);
  elmers.add(value);
  elmers.endPackage();
  String payload = elmers.getPackage();

  publishMqttMessage(playerTopic, payload);
}

// void buildControllerMessage(int value){
//   // build the parsable message from Strings
//   sendMessage = "*";
//   sendMessage += String(playerName);
//   sendMessage += ",";
//   sendMessage += String(value);
//   sendMessage += ",#";
//
//   publishMqttMessage(playerTopic, sendMessage);
// }
