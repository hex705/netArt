
//===================================================
// global variables -- move to top of main file

#include <WiFi.h>
WiFiClient wifiClient;  // part of wifi.h

//===================================================
// setup -- before transport protocols that use this

initWiFi();

//===================================================
// initialize -- leave in own tab or at bottom of main code

void initWiFi() {
  WiFi.mode(WIFI_STA);  // station mode
  WiFi.begin(ssid, password);

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
