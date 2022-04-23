//===================================================
// sends sensro data to intermediate browser
// browser send sensor data along to MQTT


//===================================================
#include <Scissors.h>
#include <Glue.h>

Scissors scissors;
Glue  elmers;

// this is needed for pong -- simlest to add it now
String playerName = "steve";


//**************************************************
// actuator circuits and states
int ledPin = 6; // can be digital or PWM
int ledState;


// sensor circuits and states
int sensorPin = 9;
int sensorState;


//==++==++==++==++==++==++==++==++==++==++==++==++==
// send timer variables -- flow control of data
unsigned long sendInterval = 100;
unsigned long timeNow, startTime;


//===================================================
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  scissors.begin(Serial);
  elmers.begin(Serial);

  //**************************
  // circuit setup
  pinMode(ledPin, OUTPUT);
  pinMode(sensorPin, INPUT);
}


//===================================================
void loop() {
  timeNow = millis();

  //****************************************
  // send timer
  if (( timeNow-startTime) > sendInterval){
    readSensors();
    sendSerial();
    startTime += sendInterval;
  }

  //==++==++==++==++==++==++==++==++==++==++
  // listen for incoming messages
  if(scissors.listen()>0){
    // do stuff with incoming data
  }

} // loops


void readSensors(){
  sensorState = digitalRead(sensorPin)*127; // scaling up the button with *127
  // additional sensor inputs here
}

void sendSerial(){
  elmers.create();
  elmers.add(playerName);
  elmers.add(sensorState);
  // elmers.add(additional data here); // you can add more than one sensor
  elmers.send();
}
