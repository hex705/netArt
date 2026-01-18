// hardware layer connections
// this example uses WIFI so we need to connect to a WiFi network

void initWiFi() {
  WiFi.mode(WIFI_STA);  // station mode
  WiFi.begin(ssid, password); // see secrets tab

  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  Serial.print("connected to ");
  Serial.println(ssid);
  Serial.print("with IP ");
  Serial.println(WiFi.localIP());

} // end initWifi
