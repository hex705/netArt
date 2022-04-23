// serial utility functions

let in0, in1;
let serialInString;
let mqttOutPayload;

//===================================================
function serialEvent() {
   // capture and clean incoming string
   serialInString
   serialInString = serial.readLine(); // looks for newline
   trim(serialInString); // remove white space
   if (!serialInString) return; // if empty
   latestData = serialInString; // for dislpay

   log("serial in string ==> " + serialInString);
            //  parseSerialForMqtt(serialInString); // message specific
    mqttOutPayload = serialInString;

    // forward serialIN to mqttPublish
    publishMqttMessage(mqttOutTopic, mqttOutPayload)
}

//===================================================
// message specific info handling
function parseSerialForMqtt(theString){
  // parse string
  //console.log("latestData " + latestData);
  elements = theString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas

  mqttOutTopic = String(elements[0]);
  mqttOutPayload ="*";
  for ( let i = 1; i < elements.length-1; i++){
    mqttOutPayload += elements[i];
    mqttOutPayload += ",";
  }
  mqttOutPayload +="#";
  console.log(mqttOutPayload);
  publishMqttMessage(mqttOutTopic, mqttOutPayload);
}

//===================================================
function  listSerialPorts(){
  serial.list();
  serial.on('list',  serialGetList);
}

//===================================================
function createSerialCallbacks(){
  // serial callbacks at bottom of code.
  serial.on('connected', serverConnected);
  serial.on('data',  serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('open',  serialOpen);
  serial.on('close', serialClose);

}


//===================================================
// serial boiler plate code
//===================================================

//===================================================
function serverConnected() {
 print("Connected to Server");
}

//===================================================
function serialGetList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

//===================================================
function serialOpen() {
 print("Serial Port is Open");
}

//===================================================
function serialClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

//===================================================
function serialError(theError) {
 print(theError);
}
