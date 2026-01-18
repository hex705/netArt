// log on info -- keep private

//   ***********************
//   do NOT share to github
//   ***********************


// ************** wifi login info ****************************

// at your home you can put your:
 //const char ssid[] = "YOUR_WIFI_NAME"; // wifi name
 //const char password[] = "YOUR_WIFI_PASSWORD"; // wifi password

// in rcc357 - during class
 const char ssid[] = "NETART";    // wifi name -- OR --  NETART2
 const char password[] = "rapiddiamond499";  // wifi password

// in the makerspace
 //const char ssid[] = "makerSpace-netArt";    // wifi name - check 
 //const char password[] = "rapi******d4*9";  // wifi password

// at steve's hoouse you can put his credentials:
 //const char ssid[] = "someFruit"; // wifi name
 //const char password[] = "s!"; // wifi password



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
const char mqttId[]   = "sd_motorHuzzah";  // your shiftr device (NODE) name
const char mqttUser[] = "netart-2024";    // your shiftr instance
const char mqttPW[]   = "VhVCF97cSuW7JPa8"; // your shiftr token secret

// // // *********************   end testing instance *************************************

