// hardware layer connections

void initWiFi() {

  Serial.print("\nTAB :: connectWifi.ino\n");
  Serial.print("Checking secrets.h for WIFI creds. \n");

  WiFi.mode(WIFI_STA);  // station mode
  WiFi.begin(ssid, password);  // from secrets tab 

  Serial.print("Connecting to WiFi ..");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  Serial.print("connected to ");
  Serial.println(ssid);
  Serial.print("with IP ");
  Serial.println(WiFi.localIP());
  Serial.println("\n");

} // end initWifi
