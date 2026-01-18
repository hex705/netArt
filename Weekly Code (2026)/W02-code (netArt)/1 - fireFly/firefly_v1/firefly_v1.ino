// firefly v01
// netArt topology tests 2024

// thresholds to set sensitivity
int yellowThreshold = 700; // you need to set this 
int blueThreshold   = 650; // you need to set this 

// Yellow == eyeRight, flashLeft
// away from arduino
int yellowFlashPin = 5;
int yellowFlashSTATE = 0;

int yellowEyePin = A5;
int yellowEyeBrightness = 0; // 0 - 1023

// BLUE == eyeLeft, flash right 
// close to arduino 
int blueFlashPin = 3;
int blueFlashSTATE = 0;

int blueEyePin = A3;
int blueEyeBrightness = 0; // 0 - 1023

unsigned long now, start;
unsigned long intervalON = 500;

void setup() {
  // put your setup code here, to run once:
  pinMode(blueFlashPin, OUTPUT);
  pinMode(blueEyePin, INPUT);

  pinMode(yellowFlashPin, OUTPUT);
  pinMode(yellowEyePin, INPUT);

  Serial.begin(9600);
}

void loop() {
  // read sensors 
    blueEyeBrightness = analogRead(blueEyePin);
    yellowEyeBrightness = analogRead(yellowEyePin);
    
    //debugging 

    Serial.print("B-Bright:");
    Serial.print( blueEyeBrightness );
    Serial.print("\t");
 
    Serial.print("Y-thresh:");
    Serial.print(yellowThreshold );
    Serial.print("\t");

    Serial.print("B-thresh:");
    Serial.print(blueThreshold);
    Serial.print("\t");

    Serial.print("Y-Bright:"); // teh : makes it a tag! 
    Serial.print(yellowEyeBrightness);
    Serial.print("\t");

    Serial.println();

    // interpret sensors
    blueFlashSTATE = 0;
    if ( blueEyeBrightness > blueThreshold){
      blueFlashSTATE = 1;
    }

    yellowFlashSTATE = 0;
    if ( yellowEyeBrightness > yellowThreshold){
      yellowFlashSTATE = 1;
    }

    delay(100);  // create a little lag - delays are bad on networks

    // take action 
    digitalWrite(blueFlashPin, blueFlashSTATE);
    digitalWrite(yellowFlashPin, yellowFlashSTATE);

    // now = millis();
    // if ( now - start > intervalON){
    //   testLedSTATE = 1 - testLedSTATE;
    //   digitalWrite(testLedPin, testLedSTATE);
    //   start += intervalON;
    // }
     
  }
