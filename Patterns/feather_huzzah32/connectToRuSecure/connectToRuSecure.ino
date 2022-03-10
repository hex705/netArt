// connect to wifi with adafruit feather32 (esp32)
// verbose 
// NOTE: you can remove the array of strings and printWiFiStatus in production
// as these are just for debug

// there are lots of other esp32 functions:
// https://randomnerdtutorials.com/esp32-useful-wi-fi-functions-arduino/#4

#include <WiFi.h> // included in esp32 package
#include "esp_wpa2.h" //wpa2 library for connections to Enterprise networks

// wifi password and ssid in secrets.h
#include "secrets.h"

// this is memory intensive so for this demo only
// wifi status is actually an int so, 
// array position corresponds to numerical value of WiFi.status();
String wifiStatusArray[7] = {"WL_IDLE_STATUS","WL_NO_SSID_AVAIL","WL_SCAN_COMPLETED","WL_CONNECTED","WL_CONNECT_FAILED","WL_CONNECTION_LOST","WL_DISCONNECTED"};
int counter = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  printWiFiStatus();
  initRUSecureWiFi();
}

void loop() {
  // put your main code here, to run repeatedly:
  printWiFiStatus();
  Serial.println("demo complete");
  while(1);
}

void initRUSecureWiFi(){

  WiFi.disconnect(true);  //disconnect form wifi to set new wifi connection
  WiFi.mode(WIFI_STA); //init wifi mode
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY)); //provide identity
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY)); //provide username --> identity and username is same
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD)); //provide password
  esp_wifi_sta_wpa2_ent_enable();
  WiFi.begin(ssid); //connect to wifi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    printWiFiStatus();
    counter++;
    if(counter>=60){ //after 30 seconds timeout - reset board
      ESP.restart();
    }
  }
}

// this is the basic connection function - left here for reference 
// uncomment if you want to try connecting to NETART or home networks.

//void initWiFi() {
//  
//  WiFi.mode(WIFI_STA);  // station mode -- not needed if you are not changing modes
//  WiFi.begin(ssid, password);  // secrets.h tab
//  
//  Serial.println("Connecting to WiFi ..");
//  while (WiFi.status() != WL_CONNECTED) {
//    Serial.print('.');
//    printWiFiStatus();
//    delay(500);
//  }
//  
//  Serial.print("\nconnected to ");
//  Serial.println(ssid);
//  Serial.print("with IP ");
//  Serial.println(WiFi.localIP());
//}

// utility function -- uses array of states at top of code
void printWiFiStatus(){
  int wifistatus = WiFi.status(); 
  Serial.print("Wifi status = " );
  Serial.println( wifiStatusArray[ wifistatus ] );
}
