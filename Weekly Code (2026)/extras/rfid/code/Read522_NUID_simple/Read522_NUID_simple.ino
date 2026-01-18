/*

https://github.com/miguelbalboa/rfid/blob/master/src/MFRC522.h


 * --------------------------------------------------------------------------------------------------------------------
 * Example sketch/program showing how to read new NUID from a PICC to serial.
 * --------------------------------------------------------------------------------------------------------------------
 * This is a MFRC522 library example; for further details and other examples see: https://github.com/miguelbalboa/rfid
 * 
 * Example sketch/program showing how to the read data from a PICC (that is: a RFID Tag or Card) using a MFRC522 based RFID
 * Reader on the Arduino SPI interface.
 * 
 * When the Arduino and the MFRC522 module are connected (see the pin layout below), load this sketch into Arduino IDE
 * then verify/compile and upload it. To see the output: use Tools, Serial Monitor of the IDE (hit Ctrl+Shft+M). When
 * you present a PICC (that is: a RFID Tag or Card) at reading distance of the MFRC522 Reader/PCD, the serial output
 * will show the type, and the NUID if a new card has been detected. Note: you may see "Timeout in communication" messages
 * when removing the PICC from reading distance too early.
 * 
 * @license Released into the public domain.
 * 
 * Typical pin layout used:
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
 *             Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
 * Signal      Pin          Pin           Pin       Pin        Pin              Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
 * SPI SS      SDA(SS)      10            53        D10        10               10
 * SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
 * SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
 * SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
 *
 * More pin layouts for other boards can be found here: https://github.com/miguelbalboa/rfid#pin-layout
 */

 /* for esp32 huzzah 32 from adafruit - tested 2024
 * works with huzzah
 * RST/Reset   RST          21           
 * SPI SS      SDA(SS)      23           
 * SPI MOSI    MOSI         18 
 * SPI MISO    MISO         19 
 * SPI SCK     SCK          5   
 */

#include <SPI.h>
#include <MFRC522.h>

// UNO settings - comment out the ESP below
#define SS_PIN 10 // (uno)
#define RST_PIN 9 // (uno)

// ESP settings - comment out the UNO above
//#define SS_PIN 23  // (esp)
//#define RST_PIN 21 // (esp)
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class


// kind of tag the 522 can read -- code for this commented out -- but just in case ... 
MFRC522::PICC_Type compatableTagType = MFRC522::PICC_TYPE_MIFARE_1K;

// string to store incoming tag ID
String newTagID = "";
String oldTagID = "";

void setup() { 
  Serial.begin(9600);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 
}
 
void loop() {

  readRC522(); // check the reader
  Serial.println(newTagID);
  oldTagID = newTagID;
  newTagID = "";
}

void readRC522(){

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! rfid.PICC_IsNewCardPresent())
  {
     Serial.println("no card");
       newTagID = "squid";

       return;
    }
    else {
      
     
    }

  // Verify if the NUID has been read
  if ( ! rfid.PICC_ReadCardSerial())
    return;

  // // Check tosee if tag is the Classic MIFARE type (1k)
  // Serial.print("Tag read, type: ");
  // MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  // Serial.println(rfid.PICC_GetTypeName(piccType));

  // if (piccType != compatableTagType) {
  //   Serial.println(F("Your tag is not compatable with this reader"));
  //   return;
  // }

    // place new ID into a string for comparison and use 
    for (byte i = 0; i < 4; i++) {
     // nuidPICC[i] = rfid.uid.uidByte[i];
      newTagID+=rfid.uid.uidByte[i];
    }

  if (oldTagID != newTagID) {
    Serial.println(F("A new tag has been detected."));
    Serial.println(newTagID);
    Serial.println();
  }
  else {
    Serial.println(F("Card read previously."));
  }

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();

} // end read 

