// log on info -- keep private

//   ***********************
//   do NOT share to github
//   ***********************


// =================================
// hardware layer -- wifi login info
// =================================

// this can be home credentials or inclass router credentials or makerspace credentials
// you can NOT connect to TMU network with this process.  TMU needs wpa2 for enterprise. 


// in rcc357 - during class
// const char ssid[] = "NETART";    // wifi name
// const char password[] = "rapiddiamond499";  // wifi password

// in the makerspace
//const char ssid[] = "makerSpace-netArt";    // wifi name - check 

// at your home you can put your:
// const char ssid[] = "YOUR_WIFI_NAME"; // wifi name
// const char password[] = "YOUR_WIFI_PASSWORD"; // wifi password

// at your home you can put your:
 const char ssid[] = "someFruit"; // wifi name
 const char password[] = "sevenAppleBanana@705!"; // wifi password



// =================================
// shiftr login info
// =================================

// https://www.shiftr.io/docs/manuals/arduino

// the class token in in D2L

// path to the broker site (shiftr in this case)
const char broker[] = "public.cloud.shiftr.io"; // yes this url for SHFTR even with unique instance
int        port     = 1883; // 8883 secure

// user ID for the broker --> derived from links above
const char id[]     = "a_netArt_FEATHER";  // your shiftr device name
const char user[]   = "public";    // your shiftr instance
const char mqttPW[] = "public";    // your shiftr token secret
