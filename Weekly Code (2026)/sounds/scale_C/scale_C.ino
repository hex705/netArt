// https://makeabilitylab.github.io/physcomp/esp32/tone.html#:~:text=Make%20sure%20your%20sound%20is,famously%20unsupported%20on%20the%20ESP32.

// Change this depending on where you put your piezo buzzer
const int TONE_OUTPUT_PIN = 26;

// The ESP32 has 16 channels which can generate 16 independent waveforms
// We'll just choose PWM channel 0 here
const int TONE_PWM_CHANNEL = 0; 

void setup() {
  // ledcAttachPin(uint8_t pin, uint8_t channel);
  ledcAttachPin(TONE_OUTPUT_PIN, TONE_PWM_CHANNEL);
}

void loop() {
  // Plays the middle C scale
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_C, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_D, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_E, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_F, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_G, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_A, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_B, 4);
  delay(500);
  ledcWriteNote(TONE_PWM_CHANNEL, NOTE_C, 5);
  delay(500);
}
