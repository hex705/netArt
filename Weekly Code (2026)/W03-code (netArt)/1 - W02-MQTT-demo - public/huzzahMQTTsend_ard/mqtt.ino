// note mqttClient is globally defined in main tab


// establishes the MQTT connection to shifter
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
  Serial.println(user); // instance name
  Serial.println("check : https://www.shiftr.io/try");  // replace if you change the URL
} // end initMqtt


// generic huzzah32 MQTT send function
void publishMqttMessage(String topicString, String payload){
   mqttClient.beginMessage(topicString);
   mqttClient.print(payload);
   mqttClient.endMessage();
}
