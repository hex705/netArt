int myPosition = 127; 

int touchPin1 = T3;
int touchPin2 = T6;
int touchValue1;
int touchValue2;

int threshold = 40;

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  touchValue1 = touchRead(touchPin1);
  touchValue2 = touchRead(touchPin2);
  
  Serial.print(touchValue1);
  Serial.print('\t');
  Serial.print(touchValue2);
  Serial.print('\t');
  Serial.print(threshold);
  Serial.print('\t');
  calculatePosition();
  Serial.println(myPosition);
  delay(50);// affects repeat 
}


void calculatePosition(){
  
  if ( touchValue1 <= threshold) myPosition -= 10;
  if ( touchValue2 <= threshold) myPosition += 10;
  if ( myPosition <= 0) myPosition = 0;
  if ( myPosition >= 255) myPosition = 255; 

  
  
}
