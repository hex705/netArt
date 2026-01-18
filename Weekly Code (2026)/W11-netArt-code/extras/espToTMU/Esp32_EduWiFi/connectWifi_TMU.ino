// hardware layer connections

void initWiFi() {

  Serial.print("\nTAB :: connectWifi.ino\n");
  Serial.print("Checking secrets.h for WIFI creds. \n");

  WiFi.mode(WIFI_STA);  // station mode
  
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  // some extra work for TMU -- see secrets for these variables ! 
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD));
  esp_wifi_sta_wpa2_ent_enable();

  WiFi.begin(ssid);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print('.');
    delay(1000);
  }

  Serial.print("connected to ");
  Serial.println(ssid);
  Serial.print("with IP ");
  Serial.println(WiFi.localIP());
  Serial.println("\n");

} // end initWifi



  // // TMU connection process 
  // WiFi.disconnect(true); //disconnect from wifi to set new wifi connection
  // WiFi.mode(WIFI_STA);   //init wifi mode
  // // Serial.print("MAC >> ");
  // // Serial.println(WiFi.macAddress());
  // Serial.printf("Connecting to WiFi: %s ", ssid);
  // esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  // esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  // esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD));
  // esp_wifi_sta_wpa2_ent_enable();
  // WiFi.begin(ssid);
  // while (WiFi.status() != WL_CONNECTED)
  // {
  //   delay(500);
  //   Serial.print(F("."));
  //   counter++;
  //   if (counter >= 60)
  //   { //after 30 seconds timeout - reset board
  //     ESP.restart();
  //   }
  // }
  // Serial.println(F(" connected!"));
  // Serial.print(F("IP address set: "));
  // Serial.println(WiFi.localIP()); //print LAN IP
