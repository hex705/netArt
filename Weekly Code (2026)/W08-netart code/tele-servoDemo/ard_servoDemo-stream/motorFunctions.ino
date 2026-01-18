// // motor moves
// void stopMotors(){
//   Serial.println("stop"); 
//   digitalWrite(stepRed, LOW);
//   digitalWrite(stepYellow, LOW);
//   digitalWrite(stepBlue, LOW);
//   digitalWrite(stepWhite, LOW);
// }

// void resetMove(int howFar){
//     Serial.println("clockwise");
//     myStepper.step(howFar);
//     motorPosition-=howFar;
// }

// void moveLeft(int howFar){
//   Serial.println("clockwise");
//   if ( motorPosition+howFar <= 0){
//     Serial.println("move out of range");
//   } else {
//     myStepper.step(howFar);
//     motorPosition-=howFar;
//   }
// }

// void moveRight(int howFar){
//   Serial.println("counterClockwise");
//   if ( motorPosition+howFar >= maxSteps){
//     Serial.println("move out of range");
//   } else {
//     myStepper.step(-howFar);
//     motorPosition += howFar;
//   }
// }

// void motorPositionReset(){

//   Serial.println("motorPositionReset");

//   do {
//    Serial.println("move to the left -- cw");
//    resetMove(50);

//   }while (digitalRead(resetButtonPin)==1);

//    Serial.println("on switch");
//    motorPosition = 0;

//   Serial.println("move to the right-- ccw a little");
//   moveRight(50);

// }