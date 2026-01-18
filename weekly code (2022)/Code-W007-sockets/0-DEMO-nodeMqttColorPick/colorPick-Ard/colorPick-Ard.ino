#include <Adafruit_NeoPixel.h>
#define PIN 14

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
Adafruit_NeoPixel strip = Adafruit_NeoPixel(16, PIN, NEO_GRB + NEO_KHZ800);



#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt message topics (labels)
String subscribeTopic  = "RGB-color";  // your topics (you can have many)

#include <Scissors.h>

Scissors cut;

int rPin = 14;
int gPin = 22;
int bPin = 23;

int rBrightness = 255;
int gBrightness = 0;
int bBrightness = 0;

void setup() {
  Serial.begin(9600);

  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      initMqtt();
    }

  mqttClient.subscribe(subscribeTopic);

  cut.begin(mqttClient);
//  pinMode(rPin,OUTPUT);
//  pinMode(gPin,OUTPUT);
//  pinMode(bPin,OUTPUT);
  strip.begin();
  strip.setBrightness(50);
  strip.show(); // Initialize all pixels to 'off'
}

void loop(){
  mqttClient.poll(); // need to keep Mqtt connection alive
  // expect message of form -->  * data,data,data,#
  // ie. one data point, index 0 and its an int so
  // we get the data with   -->  .getInt(0)
  if (cut.listen() > 0) {       // have a new message?
    rBrightness = cut.getInt(0);   // receiving one number from 0-255
    gBrightness = cut.getInt(1);
    bBrightness = cut.getInt(2);
    Serial.println(cut.getRaw());
  }
  setAll();
//  analogWrite(rPin, rBrightness);
//  analogWrite(gPin, gBrightness);
//  analogWrite(bPin, bBrightness);
//Serial.println(cut.getRaw());
}


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
  Serial.println(user); // instacne name

} // end initMqtt

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

void setAll(){
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(rBrightness,gBrightness,bBrightness));
    strip.show();
    //delay(25);
  }

}
