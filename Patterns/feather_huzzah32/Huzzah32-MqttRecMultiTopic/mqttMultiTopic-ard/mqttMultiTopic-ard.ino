
#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt message topics (labels)
String subscribeTopic1  = "one";  // your topics (you can have many)
String subscribeTopic2  = "two";

int oneFirst,oneSecond,twoFirst,twoSecond;

#include <Scissors.h>

Scissors cut;

int firstIncomingData = 0;
int secondIncomingData = 0;

int rPin = 14;
int gPin = 22;
int bPin = 23;

boolean newMessage = false;



int rBrightness = 255;
int gBrightness = 0;
int bBrightness = 0;

void setup() {
  Serial.begin(9600);

  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      initMqtt();
    }

  mqttClient.subscribe(subscribeTopic1);
  mqttClient.subscribe("two");

  // set the message receive callback
 mqttClient.onMessage(mqttMessageReceive);

  cut.begin(mqttClient);
  pinMode(rPin,OUTPUT);
  pinMode(gPin,OUTPUT);
  pinMode(bPin,OUTPUT);
}

void loop(){
  mqttClient.poll(); // need to keep Mqtt connection alive

  if (newMessage == true ){
  Serial.print("oneFirst :: \t");
   Serial.println(oneFirst);
   Serial.print("oneSecond :: \t");
    Serial.println(oneSecond);
    Serial.print("twoFirst :: \t");
     Serial.println(twoFirst);
     Serial.print("twoSecond :: \t");
      Serial.println(twoSecond);
      newMessage = false;
    }

}


//becasue we are expecting 2 topics we need to impliment the onMessage callback.  THis callback gives us access to the message topic 
void mqttMessageReceive(int messageSize){

  // we received a message, print out the topic and contents
  String theTopic = mqttClient.messageTopic();
  Serial.print("Received a message with topic ::");
  Serial.println(theTopic);
  Serial.print("and length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

  // extract data
  // we are sending 2 data points per topic
  if (cut.listen() > 0) {
    firstIncomingData = cut.getInt(0);   // receiving one number from 0-255
    secondIncomingData = cut.getInt(1);
    Serial.println(cut.getRaw());
  } // end if

  if (theTopic == "one"){
    oneFirst = firstIncomingData;
    oneSecond = secondIncomingData;
  }

  if (theTopic == "two"){
    twoFirst = firstIncomingData;
    twoSecond = secondIncomingData;
  }

  newMessage = true;

} // end mqttMessageReceive()
