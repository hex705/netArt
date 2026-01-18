
// button press sends a message
// MQTT loops content back via shiftr


//===================================================
// network library includes
#include <WiFi.h>

// TMU credential includes ... 
// for TMU *********
#include <esp_wpa2.h>
#include <esp_wifi.h>

// basic mqtt includes
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient
#include <Scissors.h>
#include <Glue.h>

// wifi log on credentials -- find in secrets.h tab
#include "secrets.h"

//===================================================
// global variable for network -- DO NOT CHANGE
// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

//*************** PUBLISH TOPICS ********************

// **********   mqtt message PUBLISH topics    *******
// huzzah does not speak in this example -- it listens

// **********   mqtt message SUBSCRIBE topics    *******
String subscribeTopic = "huzzahToHuzzah"; // actual subscribe in mqtt.ino, line
String publishTopic = "huzzahToHuzzah";

Scissors scissors;
Glue glue;

int newMessage = 0; 

int buttonPin = 4;
int buttonState = 0;
int lastButtonState;

int inInt;
float inFloat;
String inString;


void setup() {

  Serial.begin(9600);

  // connect wifi and shiftr (mqtt)
  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      initMqtt();
    }

  // set the message receive callback
  mqttClient.onMessage(mqttMessageReceive);

  // set parser STREAM
  scissors.begin(mqttClient); 
  glue.begin();

  pinMode(buttonPin, INPUT);

}


void loop() {

   mqttClient.poll(); // keep Mqtt connection alive, if message arrives, mqttMessageReceive() in MQTT
   scissors.poll(); //  if data, scissorsEvent() is triggered (below)  

   buttonState = digitalRead(buttonPin);

  if(buttonState == 1 and lastButtonState == 0){
     sendMessage(); // send to MQTT
  }

  lastButtonState = buttonState;

}


void scissorsEvent( String &theMessage ){  // its just a string

    // show full message
    Serial.println("\nReceived message:: ");
    Serial.println(theMessage);

    inInt = scissors.getInt(0);   // receiving one number from 0-255
    inFloat= scissors.getFloat(1);
    inString = scissors.getString(2);

    Serial.println(inInt);
    Serial.println(inFloat);
    Serial.println(inString);
    Serial.println();

}

void sendMessage(){

   glue.create();
     glue.add(1);
     glue.add(2.0f);
     glue.add("three");
     glue.endPackage();
   String payload = glue.getPackage();

   publishMqttMessage(publishTopic, payload);

   Serial.println("\nSend message payload:: ");
   Serial.println(payload);

}