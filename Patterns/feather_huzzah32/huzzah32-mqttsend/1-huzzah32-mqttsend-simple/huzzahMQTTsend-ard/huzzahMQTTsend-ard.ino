
#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt message topics (labels)
String photoCellTopic  = "photoCell";  // your topics (you can have many)
String buttonTopic= "button";

String sendMessage="";

#include <Glue.h>
Glue elmers;

// circuit variables
int photocellPin = A2; // D34
int buttonPin = 5;

int photocellState = 127;
int buttonState = 0;

// send timer -- we should listen more than we send
unsigned long sendInterval = 50;
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;

void setup() {
  Serial.begin(9600);
  elmers.begin();  // not attaching it to a stream
  pinMode(photocellPin, INPUT);
  pinMode(buttonPin, INPUT);
  analogReadResolution(10); // https://randomnerdtutorials.com/esp32-adc-analog-read-arduino-ide/#:~:text=Analog%20Inputs%20(ADC),3.3%20V%20corresponds%20to%204095.

  initWiFi();

  if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
    initMqtt();
  }
}

void loop(){
  currentTime = millis();
  mqttClient.poll(); // need to keep Mqtt connection alive

  buttonState = digitalRead(buttonPin);
  photocellState = analogRead(photocellPin);

  if ((currentTime - sendStartTime) > sendInterval){
    buildButtonMessage(buttonState);
    buildPhotocellMessage(photocellState);
    sendStartTime = currentTime;
      //debugSensors();
  }
}

void buildButtonMessage(int value){
  // use elmers to add the parsing syntax around value -- [*,#]
  elmers.create();
  elmers.add(value);
  elmers.endPackage();
  String payload = elmers.getPackage();

  publishMqttMessage(buttonTopic, payload);
}

void buildPhotocellMessage(int value){
  // build the parsable message from Strings
  sendMessage = "*";
  sendMessage += String(value);
  sendMessage += ",#";

  publishMqttMessage(photoCellTopic, sendMessage);
}

void debugSensors(){
  Serial.print("buttonState :: \t");
  Serial.println(buttonState);
  Serial.print("photocellState :: \t");
  Serial.println(photocellState);
}
