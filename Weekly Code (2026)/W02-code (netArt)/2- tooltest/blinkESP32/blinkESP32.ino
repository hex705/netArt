// simple led blink - esp32 (feather,huzzah)

int led = 13;

void setup() {
  // put your setup code here, to run once:
   pinMode(led, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(led, 1);
  delay(100);
  digitalWrite(led, 0);
  delay(500);
}
