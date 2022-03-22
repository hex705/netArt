/*
 * Ultrasonic Simple
 * Prints the distance read by an ultrasonic sensor in
 * centimeters. 
 *
 * The circuit:
 *  SRF-05 (5pin) has been tested -- 4 pin models expected to work 
 *  Attached to digital pins as follows:
 * ---------------------    
 * | HC-SC05 | Huzzh32 |    
 * ---------------------   
 * |   Vcc   |   5V    |  
 * |   Trig  |   27    | 
 * |   Echo  |   33    | ** needs voltage divider  
 * |   OUT   |   nc    | nc = no connection
 * |   Gnd   |   GND   |  
 * ---------------------
 * 
 * trig is a uC output, so it is ok on pin 27 (not affected by wifi)
 * 
 * VERY IMPORTANT 
 * echo is an input from a 5V device! 
 * those 5V must be reduced before getting to the uC to be safe
 * simplest solution -- build a voltage divider out of 2 -10K resistors
 * tap the middle for 2.5V high, 0 low.
 * 
 * ECHO pin ---
 *            |
 *            10k
 *            |------ to pin 33 on huzzah32
 *            10K
 *            |
 *       gnd---
 * 
 * 
 * Notes: 
 * 
 * You do not need to use the pins defined above but you must
 * take the votages into account. 
 * 
 * You must also be aware that the ESP32 has something called 
 * STRAPPING PINS  https://www.esp32.com/viewtopic.php?t=5970
 * 
 * -- these pins are activated during upload / download (similar to UNO pins 0/1)
 * -- pin 12 in the orignal Uno examples is an eps32 strapping pin, so I have avoided it here
 * -- when I used pin 12 and tried to upload my huzzah32 threw:
 *    <MD5 of file does not match data in flash ( fatal error )>
 *    if you insist on using pin12, disconnect it during upload and reconnect after complete. 
 * 
 * 
 * By default, the distance returned by the read()
 * method is in centimeters. To get the distance in inches,
 * pass INC as a parameter.
 * Example: ultrasonic.read(INC)
 *
 * created 3 Apr 2014
 * by Erick Simões (github: @ErickSimoes | twitter: @AloErickSimoes)
 * modified 23 Jan 2017
 * by Erick Simões (github: @ErickSimoes | twitter: @AloErickSimoes)
 * modified 03 Mar 2017
 * by Erick Simões (github: @ErickSimoes | twitter: @AloErickSimoes)
 * modified 11 Jun 2018
 * by Erick Simões (github: @ErickSimoes | twitter: @AloErickSimoes)
 * 
 * mod for esp32 march 2022 -- steve daniels (hex705)
 *
 * This example code is released into the MIT License.
 */

#include <Ultrasonic.h> // https://github.com/ErickSimoes/Ultrasonic

/*
 * Pass as a parameter the trigger and echo pin, respectively,
 * or only the signal pin (for sensors 3 pins), like:
 * Ultrasonic ultrasonic(13);
 */
Ultrasonic ultrasonic(27, 33);  // trg = 27, echo = 33
int distance;

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Pass INC as a parameter to get the distance in inches
  distance = ultrasonic.read();
  
  //Serial.print("Distance in CM: ");// comment out for plotter
  Serial.println(distance);
  delay(100);
}
