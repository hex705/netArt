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
  
  Serial.println(touchValue1);
  Serial.print('\t');
  Serial.print(touchValue2);
  Serial.print('\t');
  Serial.println(threshold);
  
}
