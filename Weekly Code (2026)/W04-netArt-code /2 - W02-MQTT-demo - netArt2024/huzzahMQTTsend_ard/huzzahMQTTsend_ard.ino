// this example assumes an adafruit esp32 huzzah (other devices may work) 
// this code uses MQTT to connects to the public 'try' instance of shifter.io
// other (remote) devices can subscribe to the messages. 


#include <WiFi.h> 
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt PUBLISH topics (labels)
String potPubTopic  = "a_potState";  // your topics (you can have many)
String buttonPubTopic= "a_buttonState";

String sendMessage="";

#include <Glue.h>
Glue elmers;

// circuit variables
int potPin = A2; // D34
int potState = 127;

int buttonPin = 5;
int buttonState = 0;

// send timer -- we should listen more than we send
unsigned long sendInterval = 50;
unsigned long sendStartTime = 0;
unsigned long currentTime = 0;

void setup() {
  Serial.begin(9600);
  Serial.println();
  elmers.begin();  // not attaching it to a stream
  pinMode(potPin, INPUT);
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
  potState = analogRead(potPin);

  if ((currentTime - sendStartTime) > sendInterval){
    buildButtonMessage(buttonState);
    buildPotMessage(potState);
    sendStartTime = currentTime;
      //  debugSensors();
  }
}

// using the glue library to make a message
void buildButtonMessage(int value){
  // use elmers to add the parsing syntax around value -- [*,#]
  elmers.create();
  elmers.add(value);
  elmers.endPackage();
  String payload = elmers.getPackage(); // MQTT needs your message in String format
  // buttonTopic defined in line 20
  publishMqttMessage(buttonPubTopic, payload);
}

// building a message manually with Strings (big S)
void buildPotMessage(int value){
  // build the parsable message from Strings
  // sendMessage is of type String -- declared in line 22 
  sendMessage = "*";
  sendMessage += String(value);
  sendMessage += ",#";
  // potTopic defined in line 21
  publishMqttMessage(potPubTopic, sendMessage);
}

// local debug may interupt network messages
void debugSensors(){
  Serial.print("buttonState :: \t");
  Serial.print(buttonState);
  Serial.print("\tpotState :: \t");
  Serial.println(potState);
}
