// firefly blink tests -- make sure LEDs work
// netArt topology tests 2024
int yellowFlashPin = 5;
int yellowFlashSTATE = 0;

int blueFlashPin = 3;
int blueFlashSTATE = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(blueFlashPin, OUTPUT);
  pinMode(yellowFlashPin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
    // take action 
    blueFlashSTATE = 1 - blueFlashSTATE;
    yellowFlashSTATE = 1 - yellowFlashSTATE;

    digitalWrite(blueFlashPin, blueFlashSTATE);
    digitalWrite(yellowFlashPin, yellowFlashSTATE);
    delay(500);
}
