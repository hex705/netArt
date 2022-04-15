
#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// ******     sensor variables    ******************
int myPosition = 127;

int touchPin1 = T3;
int touchPin2 = T6;
int touchValue1;
int touchValue2;

int touchState1, touchState2;

int old_touchState1;
int old_touchState2;

int threshold = 40;


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
unsigned long sendInterval = 50; // 20 per second 
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;

void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream

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
    calculatePosition();
    //debugSensors();
    buildControllerMessage(myPosition);
    sendStartTime = currentTime;
  }

}

void readSensors(){
  //Serial.println("readSensors");
  touchState1 = 0;
  touchState2 = 0;

  touchValue1 = touchRead(touchPin1);
  if ( touchValue1 <= threshold) touchState1 = 1;

  touchValue2 = touchRead(touchPin2);
  if ( touchValue2 <= threshold) touchState2 = 1;

}

void calculatePosition(){
  // prevent repeats
  // if (touchState1 == 1 ){
  //   if ( old_touchState1 != touchState1 )  myPosition -= 10;
  // }
  // if (touchState2 == 1 ){
  //   if ( old_touchState2 != touchState2)  myPosition += 10;
  // }
  // allow repeats
  if (touchState1 == 1 ){
    myPosition -= 10;
  }
  if (touchState2 == 1 ){
    myPosition += 10;
  }
  // keep on screen
  if ( myPosition <= 0) myPosition = 0;
  if ( myPosition >= 255) myPosition = 255;

  old_touchState1 = touchState1;
  old_touchState2 = touchState2;
}

void debugSensors(){
  Serial.print(touchValue1);
  Serial.print('\t');
  Serial.print(touchValue2);
  Serial.print('\t');
  Serial.print(threshold);
  Serial.print('\t');
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
