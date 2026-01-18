
// sliders change colors

//===================================================
// network library includes

#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient
#include <Scissors.h>
#include <Glue.h>
#include <Adafruit_NeoPixel.h>


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
String subscribeTopic = "steveRGB"; // actual subscribe in mqtt.ino, line
String publishTopic = "steveFeedback";

Scissors scissors;
Glue glue;

int newMessage = 0; 


// **********   LED ring vars ***************

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN  21 // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 16 // Popular NeoPixel ring size

// When setting up the NeoPixel library, we tell it how many pixels,
// and which pin to use to send signals. Note that for older NeoPixel
// strips you might need to change the third parameter -- see the
// strandtest example for more information on possible values.
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

// color channel values
int rBrightness = 0;
int gBrightness = 0;
int bBrightness = 0;


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

  // setup the LED ring
  pixels.begin(); 
  
  pixels.setBrightness(50); 

}

void loop() {

   mqttClient.poll(); // keep Mqtt connection alive, if message arrives, mqttMessageReceive() in MQTT
   scissors.poll(); //  if data, scissorsEvent() is triggered (below)  

   if (newMessage == 1){
     setPixels();
     sendFeedback(); // back to p5js
     newMessage = 0;
   }

}

void scissorsEvent( String &theMessage ){  // its just a string

    // show full message
    Serial.println("\nReceived ");
    Serial.println(theMessage);

    rBrightness = scissors.getInt(0);   // receiving one number from 0-255
    gBrightness = scissors.getInt(1);
    bBrightness = scissors.getInt(2);

    Serial.println(rBrightness);
    Serial.println(gBrightness);
    Serial.println(bBrightness);
    Serial.println();

    newMessage = 1;

}

void setPixels(){
  // pixels.clear(); // Set all pixel colors to 'off'

  for(int i=0; i<NUMPIXELS; i++) { // For each pixel...
    // pixels.Color() takes RGB values, from 0,0,0 up to 255,255,255
    // we want to put hte slider color on the ring 
    pixels.setPixelColor(i, pixels.Color(rBrightness, gBrightness, bBrightness));
    pixels.show();   // Send the updated pixel colors to the hardware.
  }

}

void sendFeedback(){

   glue.create();
     glue.add(bBrightness);
     glue.add(gBrightness);
     glue.add(rBrightness);
     glue.endPackage();
   String payload = glue.getPackage();

   publishMqttMessage(publishTopic, payload);

   Serial.println("feedback payload:: ");
   Serial.println(payload);

}