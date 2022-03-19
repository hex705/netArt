function setup() {
  theCanvas = createCanvas(500, 500);

  //connect to shiftr these fxns in mqtt.js
  createMQTTClientObject();
  createMQTTConnection();
  createMQTTClientCallbacks();

}
