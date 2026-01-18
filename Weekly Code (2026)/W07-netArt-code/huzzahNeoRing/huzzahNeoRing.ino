
// sliders change colors

//===================================================
// network library includes

#include <Adafruit_NeoPixel.h>


// **********   LED ring vars ***************

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN  21 //esp32 

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 16 // netArt ring size

// When setting up the NeoPixel library, we tell it how many pixels,
// and which pin to use to send signals. Note that for older NeoPixel
// strips you might need to change the third parameter -- see the
// strandtest example for more information on possible values.
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);  // gibberish the manufacturer wants you to use

// color channel variables
int rBrightness = 255;
int gBrightness = 0;
int bBrightness = 0;


void setup() {

  Serial.begin(9600);

  // setup the LED ring
  pixels.begin(); 
  pixels.setBrightness(50); // half power

}

void loop() {

   setPixels();

}



void setPixels(){
  // pixels.clear(); // Set all pixel colors to 'off'

  for(int i=0; i<NUMPIXELS; i++) { // For each pixel...
    // pixels.Color() takes RGB values, from 0,0,0 up to 255,255,255
    // we want to put hte slider color on the ring 
    pixels.setPixelColor(i, pixels.Color(rBrightness, gBrightness, bBrightness));
    pixels.show();   // Send the updated pixel colors to the hardware.
  }

}