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


//***************************************************
// PLAYER specific variables -- you need to modify
// on game day your <pongPlayerTopic> will be:
//  playerOne
//  or
//  playerTwo

// [ * playerName , playerMove , #]

String pongPlayerTopic  = "playerOne-sd";
int MY_PLAYER_INDEX = 1; //set to 1 if playerOne, 2 if playerTwo
String playerName = "steve"; // your player name


//===================================================
// MQTT message topics and variables - DO NOT CHANGE

String sendMessage= "";
String subscribeTopic = "pongGame";
int messageType, whichPlayer;

// codes for message FROM the game (feedback)
#define HIT 1
#define GOAL 2
#define WINNER 3
#define RESET 4


//===================================================
// GLUE and SCISSORS libraries support message protocol
#include <Glue.h>
Glue elmers;

#include <Scissors.h>
Scissors cut;


//**************************************************
    // global circuit variables -- project specific
    // variabels for pins and sensor values
    int paddlePosition = 127; // default = middle of screen

    // your code here
    int potPin = A7;
    int potValue = 0;

//*********



//==++==++==++==++==++==++==++==++==++==++==++==++==
// send timer -- we should listen more than we send
unsigned long sendInterval = 50; //==++ --> affects performance
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;



//===================================================
void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream

  initWiFi();

  if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
    initMqtt();
  }

  // subscribe to game topic
  mqttClient.subscribe(subscribeTopic);
  // set the message receive callback
  mqttClient.onMessage(mqttMessageReceive);
  // create and start the payload parser
  cut.begin(mqttClient);


  //*********** CIRCUIT specific variables ***********

      // your code here ...
      pinMode(potPin, INPUT);
      analogReadResolution(10); // 0 -1023


  //**************************************************

} // end setup

//===================================================
void loop(){
  currentTime = millis();
  mqttClient.poll(); // need to keep Mqtt connection alive

  if ((currentTime - sendStartTime) > sendInterval){
    //**************************************************
    // guts of your controller here
    // your code here
    // or
    sensorRead();
    calculatePosition();

    buildPongMessage(paddlePosition);
    //**************************************************
    sendStartTime = currentTime;
    //debugSensors();
  }
} // end loop

//**************************************************
// contents of this function are circuit dependant
void sensorRead(){
   // your code here
   potValue = analogRead(potPin);  // 0 - 1023

}

//**************************************************
// you will likely need to do some work with the raw sensor reading
// to get your paddle position
void calculatePosition(){
   // your code here
   paddlePosition = potValue / 4; // 0 -255

   if ( paddlePosition > 255 ) paddlePosition = 255;
   if ( paddlePosition < 0   ) paddlePosition = 0;
}

//**************************************************
// build your controller message of form
// [ * playerName , playerMove , #]
void buildPongMessage(int moveValue){
  // use elmers to add the parsing syntax around value -- [*,#]
  elmers.create();
  elmers.add(playerName);
  elmers.add(moveValue);
  elmers.endPackage();
  String payload = elmers.getPackage();

  publishMqttMessage(pongPlayerTopic, payload);
}

//**************************************************
void debugSensors(){
  // contents here should reflect your sensors
  // decide if you are plotting or monitoring

  // your code here

}
