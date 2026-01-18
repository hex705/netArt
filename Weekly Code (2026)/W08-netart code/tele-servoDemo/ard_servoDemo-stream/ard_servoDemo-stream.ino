

// remote control a servo with webpage
// see the servo actions in web stream 


// *********** need to install library **************
// ESP32Servo by Kevin Harrington, John K. Bennett
// search -- ESP32Servo in libraries interface 
// *********** +++++++++++++++++++++++ **************

//===================================================
// network library includes
#include <ESP32Servo.h>
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
String subscribeTopic = "demo_servoControl"; // actual subscribe in mqtt.ino, line
String publishTopic = "servoPosition";

Scissors scissors;
Glue glue;

#define SERVO_CCW 1
#define SERVO_CW 2
#define SERVO_RESET 3
#define SERVO_GET_POSITION 4

// action from internet
int action = -1;
int newMessage = 0;

// servo variables 
Servo myservo;
int servoPosition = 90;

int servoPin = 18;  // see library example for pins you can use 


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

  // set servo needs

	// Allow allocation of all timers -- seems overkill but it matters. 

	ESP32PWM::allocateTimer(0);
	ESP32PWM::allocateTimer(1);
	ESP32PWM::allocateTimer(2);
	ESP32PWM::allocateTimer(3);
  myservo.setPeriodHertz(50);// Standard 50hz servo

  myservo.attach(servoPin, 500, 3000);

   servoUpdate(); // way at bottom of this tab 

}

void loop() {

    mqttClient.poll(); // keep Mqtt connection alive, if message arrives, mqttMessageReceive() in MQTT
    scissors.poll(); //  if data, scissorsEvent() is triggered (below)  


#define CCW 1
#define CW 2
#define RESET 3
#define GET_POSITION 4

   if (newMessage == 1){
    // take action
    switch (action) {
      case SERVO_CCW:
        Serial.println("ccw");
        servoPosition+=10;
        servoUpdate();
        break;

      case SERVO_CW:
         Serial.println("cw");
         servoPosition-=10;
         servoUpdate();
        break;

      case SERVO_RESET:
         Serial.println("reset");
         servoPosition=90;
         servoUpdate();
        break;

      case SERVO_GET_POSITION:
         Serial.println("get");
         sendPosition(); 
        break;

      default:

        break;
      }
     newMessage = 0;
   }

}

void scissorsEvent( String &theMessage ){  // its just a string

    // show full message
    Serial.println("\nReceived ");
    Serial.println(theMessage);

    action = scissors.getInt(0);   // receiving one number from 0-255

    Serial.print("action:: ");
    Serial.println(action);
    Serial.println();

    newMessage = 1;

}

void sendPosition(){

   glue.create();
    glue.add(servoPosition);
    glue.endPackage();
    String payload = glue.getPackage();

   publishMqttMessage(publishTopic, payload);

   Serial.println("feedback payload:: ");
   Serial.println(payload);
}


void servoUpdate(){
  for (int i = 0; i <= 3; i++){
       myservo.write(servoPosition);
       delay(15);
  }
}