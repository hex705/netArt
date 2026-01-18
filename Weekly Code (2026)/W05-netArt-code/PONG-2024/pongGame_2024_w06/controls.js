
let classic = 0;
//let roundBall = radius;
let fullScreenState = false;


function keyPressed(e){
  if (e.repeat) {return}
  //https://davidwalsh.name/javascript-debounce-function

  if ( key === 'f' || key ==='F'){

    fs = fullscreen(); // get current screen status
    console.log("screen state before press " + fs);
    fullscreen(!fs);       // change it
    fullScreenState = !fullScreenState;
    if (fullScreenState === true){
      canvas.className = "fullscreen";
    } else {
      canvas.className = "";
    }
    console.log("screen state AFTER press " + fs);
  }

  if ( key ==='c'  || key === 'C' ){
    connectMQTT();
    sleep(300);
    p.gameReset();
  }


  if ( key ==='r' || key === 'R'){
    p.gameReset();
    STATE = START; //RESET;
  }

  if ( key ==='o' ){
    p.setPlayersConnected(1);
    console.log("playerConnectedCount == 1");
    sleep(300);
  }

  if ( key ==='t' ){
    p.setPlayersConnected(2);
    console.log("playerConnectedCount == 2");
    sleep(300);
  }

  // keyboard input -- ok for testing

 if (key === 'a' || key === 'A')  p.players[1].up();
 if (key === 'z' || key === 'Z')  p.players[1].down();
 if (p.playersCount>=1){
     if (key === 'k' || key === 'K')  p.players[2].up();
     if (key === 'm' || key === 'M')  p.players[2].down();
 }
    // if (key == 'r' || key == 'R') {
    //    p.softReset();
    //    STATE = START;
    //   }

}

function keyReleased(e){
  if (e.repeat) {return}
     if( STATE === SKILL_LEVEL){
     
      if (key > '0' && key < '4') {
        console.log("in gamestates -- getSkillLevel -- key == " + key);
        p.setSkill(key);
        console.log("skill set to " + p.players[1].skill);
        STATE = SERVE;
      }
      sleep(300);
    }
  
}
