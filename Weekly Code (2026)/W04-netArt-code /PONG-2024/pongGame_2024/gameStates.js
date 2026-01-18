function maintainScreen(){
   p.f.update();

   for (let i = 1; i <= p.playersCount; i ++ ) {
          p.players[i].update();
      }
}

function getNumberOfPlayers() {
    fill(fieldColor);
    noStroke();
    //  rect(width/2-250, height/2-40, 500, 80);

    // Pong
    fill(0,200,50);
    textFont(titleFont, 150);
    textAlign(CENTER,CENTER);
    text ("PONG!", width/2, height*.25);
    fill(255, 0, 0);

     textFont(scoreFont, 40);
    // textAlign(CENTER,CENTER);
    text ("How many players ? (1/2)", width/2, height/2);
    textFont (scoreFont, 128);
    textAlign(CENTER,LEFT);

    if (keyPressed) {
      if (key > '0' && key < '3') {
        console.log("key in getPlayers ==  " +  key);
        //p.setPlayerCount(key)
        numberOfPlayers = key;
        p = new Pong(numberOfPlayers, maximumScore);
       //await delay(100); //https://stackoverflow.com/questions/17176046/pause-function-until-enter-key-is-pressed-javascript
       console.log("game created with players set to " + numberOfPlayers);
       STATE = AWAIT_PLAYERS;
       console.log("STATE = AWAIT_PLAYERS");
      }
    }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function displayWaitMessage() {
  textFont(scoreFont, 40);
  fill(fieldColor);
  noStroke();

  let waitString = String ("Waiting for players");
  let waitWidth = textWidth(waitString);
  fill(0,0,100);
 // rect(width/2-waitWidth/2, height/2-50, waitWidth+40,200);
  fill(255, 0, 0);
  text (waitString, width/2+10, height/2);

  let cc = String ( "Currently " + p.playersConnected + " connected");
  ccWidth  = textWidth(cc);
  text ( cc , width/2+20, height/2+100);

  textFont (scoreFont, 128);  // what is this for -- scores I guess ?
  // NOTE :: player count currently switched in controls.
}

function getSkillLevel(){

  textFont(scoreFont, 35);
  fill(fieldColor); // fieldColor
  noStroke();
  rect(width/2-200, 150, 400, 200);
  fill(255, 0, 0);

  text ("SELECT LEVEL: \n\r1) Super Simple\n\r2) Moderately Impossible\n\r3) Bone Crushing", width/2, height/2-100);
  textFont ( scoreFont, 128);  // i think this must be for next funtion? 
  delay(500);


}
