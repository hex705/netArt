// firefly v02
// netArt topology tests 2024
// timers for latency and lag -- adds a ton of code


//  ++++++++++++++++++++++++++++++++++++++++++++++
//  user variables 
//  thresholds to set sensitivity
//  ----------------------------------------------

int yellowThreshold = 125; // you need to set this              
int blueThreshold   = 130; // you need to set this                 



//  delay times to control lags
//  --------------------------------------------
unsigned long LAG = 200; // set all timers same ::  NOTE you can set each one differently below.

//  ++++++++++++++++++++++++++++++++++++++++++ END


//  ============================================
//  BLUE FIREFLY variables 
//  ============================================

// blue timers -- on lag, off lag 
unsigned long blueOnLagTime = LAG;  // can customize was LAG
unsigned long blueOffLagTime = LAG; // can customize was LAG
unsigned long blueOnStart = 0;
unsigned long blueOffStart = 0;

// state variables:
// sequence is listen (detect) --> onLag --> speak --> offLag --> listen
// BLUE STATES
const int BLUE_LISTENING = 1;
const int BLUE_ON_DELAY  = 2;  // impacts "responsiveness"
const int BLUE_SPEAKING  = 3;
const int BLUE_OFF_DELAY = 4;  // impacts duration (amplification)
int BLUE_STATE = BLUE_LISTENING;

// BLUE == eyeLeft, flash right 
// close to arduino 
int blueFlashPin = 3;
//int blueFlashSTATE = 0;

int blueEyePin = A3;
int blueCurrentEyeBrightness = 0; // 0 - 1023
int blueLastEyeBrightness = 0; // 0 - 1023


//  ============================================
//  YELLOW FIREFLY variables 
//  ============================================

// yellow timers -- on lag, off lag 
unsigned long yellowOnLagTime = LAG;  // can customize was LAG
unsigned long yellowOffLagTime = LAG; // can customize was LAG
unsigned long yellowOnStart = 0;
unsigned long yellowOffStart = 0;

// YELLOW STATES
const int YELLOW_LISTENING = 1;
const int YELLOW_ON_DELAY  = 2;  // impacts "responsiveness"
const int YELLOW_SPEAKING  = 3;
const int YELLOW_OFF_DELAY = 4;  // impacts duration (amplification)
int YELLOW_STATE = YELLOW_LISTENING;

// Yellow == eyeRight, flashLeft
// away from arduino
int yellowFlashPin = 5;
// int yellowFlashSTATE = 0;

int yellowEyePin = A5;
int yellowCurrentEyeBrightness = 0; // 0 - 1023
int yellowLastEyeBrightness = 0; // 0 - 1023


// general timer variable
unsigned long now;  // one general timer for everyone


void setup() {
  // put your setup code here, to run once:
  pinMode(blueFlashPin, OUTPUT);
  pinMode(blueEyePin, INPUT);

  pinMode(yellowFlashPin, OUTPUT);
  pinMode(yellowEyePin, INPUT);

  Serial.begin(9600);
}

void loop() {
  // get time for this loop
  debug(); // see teh values to set the thresold. 

  now = millis();

    // +++++++++++++++++++++++++++++
    // BLUE FIRE FLY CODE 
    // +++++++++++++++++++++++++++++

    // we will listen and threshold readings 
    // then use threshold and timers to advance through STATES (switch..case)
    // thresholds activate lags, timers terminate lags. 

    // LISTEN -- read sensors 
    blueCurrentEyeBrightness = analogRead(blueEyePin);

    // THRESHOLD AND EDGE DETECT ( RAISING // FALLING) 

      // blue reading above, last time below -- RAISING -- start of flash
      if (( blueCurrentEyeBrightness >= blueThreshold) && ( blueLastEyeBrightness <= blueThreshold )){  
       // raising edge start ON delay
       BLUE_STATE = BLUE_ON_DELAY;
       blueOnStart = now;  // start ON delay timer
      } // end if

      // blue reading below, last time above -- FALLING -- end of flash
      if ((blueCurrentEyeBrightness <= blueThreshold) && ( blueLastEyeBrightness >= blueThreshold )){  
       // falling edge start OFF delay
       BLUE_STATE = BLUE_OFF_DELAY;
       blueOffStart = now;  // start OFF delay timer
      } // end if
      // blue reading below ... change state here OFF_DELAY

    switch (BLUE_STATE) {
     case(BLUE_LISTENING):{
      // LED OFF - we are listening 
      digitalWrite( blueFlashPin, 0); 
     } // end case
     break;

     case(BLUE_ON_DELAY):{
      // use a timer to create a SPEAK DELAY  -- waiting to speak. 
      if ( now - blueOnStart >= blueOnLagTime){ 
        // when timer expires
        BLUE_STATE = BLUE_SPEAKING;
      }// end timer 
     }// end case
     break;

    case(BLUE_SPEAKING):{
      // LED ON - we are speaking!
      digitalWrite( blueFlashPin, 1); 
     }// end case
     break;

    case(BLUE_OFF_DELAY):{
      // use a timer to set up SPEAK DELAY
      if ( now -  blueOffStart >= blueOffLagTime){ 
        // when timer expires
        digitalWrite( blueFlashPin, 0); // LED OFF - to be sure
        BLUE_STATE = BLUE_LISTENING;    // go back to listening the flash is done
      } // end timer
     }// end case
     break;

    }

    // +++++++++++++++++++++++++++++
    // YELLOW FIRE FLY CODE 
    // +++++++++++++++++++++++++++++
    
    // we will listen and threshold readings 
    // then use threshold and timers to advance through STATES (switch..case)
    // thresholds activate lags, timers terminate lags. 

    // LISTEN -- read sensors 
    yellowCurrentEyeBrightness = analogRead(yellowEyePin);

    // THRESHOLD AND EDGE DETECT ( RAISING // FALLING) 

      // blue reading above, last time below -- RAISING -- start of flash
      if (( yellowCurrentEyeBrightness >= yellowThreshold) && ( yellowLastEyeBrightness <= yellowThreshold )){  
       // raising edge start ON delay
       YELLOW_STATE = YELLOW_ON_DELAY;
       yellowOnStart = now;  // start ON delay timer
      } // end if

      // blue reading below, last time above -- FALLING -- end of flash
      if ((yellowCurrentEyeBrightness <= yellowThreshold) && ( yellowLastEyeBrightness >= yellowThreshold )){  
       // falling edge start OFF delay
       YELLOW_STATE = YELLOW_OFF_DELAY;
       yellowOffStart = now;  // start OFF delay timer
      } // end if
      // blue reading below ... change state here OFF_DELAY


    switch (YELLOW_STATE) {
     case(YELLOW_LISTENING):{
      // LED OFF - we are listening 
      digitalWrite( yellowFlashPin, 0); 
     } // end case
     break;

     case(YELLOW_ON_DELAY):{
      // use a timer to create a SPEAK DELAY  -- waiting to speak. 
      if ( now - yellowOnStart >= yellowOnLagTime){ 
        // when timer expires
        YELLOW_STATE = BLUE_SPEAKING;
      }// end timer 
     }// end case
     break;

    case(YELLOW_SPEAKING):{
      // LED ON - we are speaking!
      digitalWrite( yellowFlashPin, 1); 
     }// end case
     break;

    case(YELLOW_OFF_DELAY):{
      // use a timer to set up SPEAK DELAY
      if ( now -  yellowOffStart >= yellowOffLagTime){ 
        // when timer expires
        digitalWrite( yellowFlashPin, 0); // LED OFF - to be sure
        YELLOW_STATE = YELLOW_LISTENING;    // go back to listening the flash is done
      } // end timer
     }// end case
     break;

    }

    // save states for edge detection
    blueLastEyeBrightness = blueCurrentEyeBrightness;
    yellowLastEyeBrightness = yellowCurrentEyeBrightness;

  } // end loop 

  void debug(){
     //debugging 

    Serial.print("B-Bright:");
    Serial.print( blueCurrentEyeBrightness );
    Serial.print("\t");
 
    Serial.print("Y-thresh:");
    Serial.print(yellowThreshold );
    Serial.print("\t");

    Serial.print("B-thresh:");
    Serial.print(blueThreshold);
    Serial.print("\t");

    Serial.print("Y-Bright:"); // teh : makes it a tag! 
    Serial.print(yellowCurrentEyeBrightness);
    Serial.print("\t");

    Serial.println();

  }
