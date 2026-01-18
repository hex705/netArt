#include <WiFi.h>

// for TMU *********
#include <esp_wpa2.h>
#include <esp_wifi.h>

// needed for all networks 
#include "secrets.h"


void setup()
{

  Serial.begin(9600);
  Serial.println();

  initWiFi();

  Serial.println("If connected to <TMU> you will get an IP with 10.16.xyz.xyz");

}

void loop(){
  
}