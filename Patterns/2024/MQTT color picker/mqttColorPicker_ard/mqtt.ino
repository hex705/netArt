// note mqttClient is globally defined in main tab

void initMqtt(){
 // https://github.com/arduino-libraries/ArduinoMqttClient/blob/master/examples/WiFiSimpleSender/WiFiSimpleSender.ino

  Serial.print("TAB :: mqtt.ino\n");
  // from secrets tab
  Serial.print("Checking secrets.h for MQTT creds. \n");

  mqttClient.setId(mqttId); // device or NODE name, secrets tab 
  mqttClient.setUsernamePassword(mqttUser, mqttPW); // secrets tab, user:pw from token
  

  Serial.print("\nconnecting to shiftr...");
  while (!mqttClient.connect(broker,port)) { // URL :port for shiftr instance
    Serial.print(".");
    delay(500);
  }

  Serial.print("\n\nconnected to shiftr as (NODE):: ");
  Serial.println(mqttId); // your NODE name

  Serial.print("shiftr instance can be found at :: ");
  Serial.println(broker); // URL

  // subscribe here
  mqttClient.subscribe(subscribeTopic);
    Serial.print("SUBscribe topic:: ");
    Serial.println(subscribeTopic);

  Serial.print("PUBlishing TOPIC :: ");
  Serial.println("not publishing in this example");  // TOPIC

} // end initMqtt


// generic huzzah32 MQTT send function -- not publishing here yet
void publishMqttMessage(String topicString, String payload){
   mqttClient.beginMessage(topicString);
   mqttClient.print(payload);
   mqttClient.endMessage();
}


// generic huzzah MQTT listen function
//becasue we are expecting 2 topics we need to impliment the onMessage callback.  THis callback gives us access to the message topic 
void mqttMessageReceive(int messageSize){

  // we received a message, print out the topic and contents
  String theTopic = mqttClient.messageTopic();
  Serial.print("\nReceived a message with topic :: ");
  Serial.println(theTopic);
  Serial.print("and length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

} // end mqttMessageReceive()

