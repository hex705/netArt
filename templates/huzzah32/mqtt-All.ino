//===================================================
// global variables -- move to top of main file

// include must be globally defined in main file
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// note mqttClient needs to be globally defined in main tab -- its transport needs to be passed to constructor ( see wifi)
MqttClient mqttClient(wifiClient);

//===================================================
// setup -- before transport protocols that use this
// ASSUME using wifi

// (1) if wifi connects attempt to connect to shiftr
if ( WiFi.status() == WL_CONNECTED)  {
  initMqtt();
}

// (2) subscribe to MQTT topics
mqttClient.subscribe(subscribeTopic);

// (3) set the message receive callback 
mqttClient.onMessage(mqttMessageReceive);

//===================================================
// initialize -- leave in own tab or at bottom of main code

void initMqtt(){
 // https://github.com/arduino-libraries/ArduinoMqttClient/blob/master/examples/WiFiSimpleSender/WiFiSimpleSender.ino

  mqttClient.setId(id); // device name
  mqttClient.setUsernamePassword(user, mqttPW);

  Serial.print("\nconnecting to shiftr...");
  while (!mqttClient.connect(broker,port)) {
    Serial.print(".");
    delay(500);
  }

  Serial.print("\nconnected to shiftr @");
  Serial.println(user); // instacne name
} // end initMqtt


//===================================================
// SEND / PUBLISH -- leave in own tab or at bottom of main code

// generic huzzah32 MQTT send function
void publishMqttMessage(String topicString, String payload){
   mqttClient.beginMessage(topicString);
   mqttClient.print(payload);
   mqttClient.endMessage();
}

//===================================================
// LISTEN / RECEIVE -- leave in own tab or at bottom of main code
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
