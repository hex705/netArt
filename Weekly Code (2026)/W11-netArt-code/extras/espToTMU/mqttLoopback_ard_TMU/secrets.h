// log on info -- keep private

//   ***********************
//   do NOT share to github
//   ***********************


// ************** wifi login info ****************************
// TMU wifi credentials 


const char ssid[] = "TMU";    // wifi name 

#define EAP_IDENTITY "yourEmail@torontomu.ca"  // enter full torontomu email address
#define EAP_PASSWORD "*************"   // your torontomu password



// +********************************************************************

// shiftr login info
// https://www.shiftr.io/docs/manuals/arduino

/*                          ******************

ONLY ONE OF THE CODE BLOCKS below CAN BE ACTIVE!!!!!!!  Comment out the other. 

                            ******************
*/

// // **************  for testing on day of ... this is the CLASS instance *************

// full TOKEN in D2L
/*  mqtt://netart-2024:VhVC++++++W7JPa8@netart-2024.cloud.shiftr.io   */

// // path to the broker site (shiftr in this case)
 const char broker[] = "netart-2024.cloud.shiftr.io"; // yes this url for SHFTR even with unique instance
 int        port     = 1883; // 8883 secure

// // user ID for the broker --> derived from links above
const char mqttId[]   = "esp32-huzzah-loopback";  // your shiftr device (NODE) name
const char mqttUser[] = "netart-2024";    // your shiftr instance
const char mqttPW[]   = "VhVCF97cSuW7JPa8"; // your shiftr token secret

// // // *********************   end testing instance *************************************

