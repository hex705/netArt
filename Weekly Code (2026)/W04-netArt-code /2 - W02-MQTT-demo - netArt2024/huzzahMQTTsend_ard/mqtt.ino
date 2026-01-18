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

  Serial.println("publishing TOPICs :: ");
  Serial.println(buttonPubTopic);  // TOPIC
  Serial.println(potPubTopic);  // TOPIC

} // end initMqtt


// generic huzzah32 MQTT send function
void publishMqttMessage(String topicString, String payload){
   mqttClient.beginMessage(topicString);
   mqttClient.print(payload);
   mqttClient.endMessage();
}
