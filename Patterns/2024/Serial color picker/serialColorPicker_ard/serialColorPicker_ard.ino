
// sliders change colors

//===================================================
// library includes

#include <Scissors.h>
#include <Adafruit_NeoPixel.h>

Scissors scissors;

// **********   LED ring vars ***************

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN  21 // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 16 // Popular NeoPixel ring size

// When setting up the NeoPixel library, we tell it how many pixels,
// and which pin to use to send signals. Note that for older NeoPixel
// strips you might need to change the third parameter -- see the
// strandtest example for more information on possible values.
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

int rBrightness = 0;
int gBrightness = 0;
int bBrightness = 0;


void setup() {

  Serial.begin(9600);

  // set parser STREAM to Serial
  scissors.begin(Serial); 

  // setup the LED ring
  pixels.begin(); 
  pixels.setBrightness(50); 

}

void loop() {

   scissors.poll(); 

   setPixels();
}


void scissorsEvent( String &theMessage ){  // its just a string
     
    // show full message
    Serial.println("\nReceived ");
    Serial.println(theMessage);

    rBrightness = scissors.getInt(0);   // receiving one number from 0-255
    gBrightness = scissors.getInt(1);
    bBrightness = scissors.getInt(2);

    Serial.println(rBrightness);
    Serial.println(gBrightness);
    Serial.println(bBrightness);

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