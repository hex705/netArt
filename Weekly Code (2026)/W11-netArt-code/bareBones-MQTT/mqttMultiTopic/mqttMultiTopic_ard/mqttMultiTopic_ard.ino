
// button press sends a message
// MQTT loops content back via shiftr


//===================================================
// network library includes
#include <WiFi.h>
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
// PUBlish TOPICs
String PUBlishTopicRed   = "ard_pubRed"; 
String PUBlishTopicGreen = "ard_pubGreen"; 
String PUBlishTopicBlue  = "ard_pubBlue"; 

//SUBscribe TOPICs
String SUBscribeTopicRed   = "p5_pubRed";
String SUBscribeTopicGreen = "p5_pubGreen";
String SUBscribeTopicBlue  = "p5_pubBlue";

String  incomingTopic;


Scissors scissors;
Glue glue;

int newMessage = 0; 

int buttonPin = 4;
int buttonState = 0;
int lastButtonState;

int inRed, inGreen, inBlue;


void setup() {

  Serial.begin(9600);

  // connect wifi and shiftr (mqtt)
  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      initMqtt();
    }

  // set the message receive callback
  mqttClient.onMessage(mqttMessageReceive);
  
  mqttClient.subscribe(SUBscribeTopicRed);
  mqttClient.subscribe(SUBscribeTopicGreen);
  mqttClient.subscribe(SUBscribeTopicBlue);

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
     sendMessage(PUBlishTopicRed, inRed);
     sendMessage(PUBlishTopicGreen, inGreen);
     sendMessage(PUBlishTopicBlue, inBlue);

  }

  lastButtonState = buttonState;

}

void sendMessage(String PUBTopic, int sendValue){

   glue.create();
     glue.add(sendValue);
   glue.endPackage();

   String payload = glue.getPackage();

   publishMqttMessage(PUBTopic, payload);

   Serial.println("\nSend message:: ");
   Serial.print(PUBTopic);
   Serial.print(" :: ");
   Serial.println(payload);

}


void scissorsEvent( String &theMessage ){  // its just a string

  Serial.println("scissors Event");

    // show full message
    Serial.println("\nReceived message:: ");
    Serial.print(incomingTopic);
    Serial.print(" :: " );
    Serial.println(theMessage);

    if ( incomingTopic == SUBscribeTopicRed){
      inRed = scissors.getInt(0);
      sendMessage(PUBlishTopicRed, inRed);
    }

    if ( incomingTopic == SUBscribeTopicGreen){
      inGreen = scissors.getInt(0);
      sendMessage(PUBlishTopicGreen, inGreen);
    }

    if ( incomingTopic == SUBscribeTopicBlue){
      inBlue = scissors.getInt(0);
      sendMessage(PUBlishTopicBlue, inBlue);
    }

    Serial.println();

}

