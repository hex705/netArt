int touchPin = T3;
int touchValue;

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  touchValue = touchRead(touchPin);
  Serial.println(touchValue);
}
