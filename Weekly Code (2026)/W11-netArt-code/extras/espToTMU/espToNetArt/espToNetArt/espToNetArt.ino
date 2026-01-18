
// button press sends a message
// MQTT loops content back via shiftr


//===================================================
// network library includes
#include <WiFi.h>

// wifi log on credentials -- find in secrets.h tab
#include "secrets.h"


void setup() {

  Serial.begin(9600);
  Serial.println();

  // connect wifi and shiftr (mqtt)
  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      Serial.println("success!");
    }

  Serial.println("If connected to <NETART> you will get an IP with 141.117.xyz.xyz");

}


void loop() {
    ;
}
