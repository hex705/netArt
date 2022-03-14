int buttonPin = 5;
int buttonState = 0; 

int photocellPin = A2;
int photocellState = 0; 


void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);
  analogReadResolution(10);

  pinMode(buttonPin, INPUT);
  pinMode(photocellPin, INPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  buttonState = digitalRead(buttonPin);
  photocellState = analogRead(photocellPin);
  
  debugSensors();

}

void debugSensors(){
  Serial.print("button / photocell " );
  Serial.print(buttonState);
  Serial.print("\t");
  //Serial.print("photocell " );
  Serial.println(photocellState);
}
