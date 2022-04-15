
int touchPin1 = T3;
int touchValue1;

int threshold = 40; // use plotter to define

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  touchValue1 = touchRead(touchPin1);

  Serial.print(touchValue1);
  Serial.print('\t');
  Serial.println(threshold);
  delay(50);// affects repeat 
}



 
