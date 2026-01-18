class Pong {

  skillLevel = 3;
  c = color(0,0,0);
  winner = 0;

  constructor(_players, _maxScore){
    this.id = 0;
    this.skillScale = 25;
    this.maxScore = _maxScore;
    this.playersConnected = 0;
    this.playersCount = _players;
    this.f = new Field( this.playersCount, 1 );
    this.players = [];
    this.lastPoint=1;
    console.log("PONG :: create player");
    this.players[1] = new Player(1, this.skillLevel);

    if (this.playersCount == 2) {
        this.players[2] = new Player(2, this.skillLevel);
    }

    //gameReset();

    console.log("Game inititalized");

  }// end constructor

  gameReset() {

    console.log("RESET GAME");

    for (let i = 1; i <= this.playersCount; i ++){
          this.players[i].score = 0;
    }

    this.ballReset();

    this.f.drawField();

    // reset scores
    for (let i = 1; i <= this.playersCount; i ++ ) {
          this.players[i].update();
    }
    this.drawScore();

    STATE= RESET;

    this.playersCount = 0;
    this.playerIndex = -1;
    this.playerMove = -1;
    this.playerType = "";

    this.playerOneConnected = false;
    this.playerTwoConnected = false;

    let s = String ("*4,2,#"); // hit by player 2
    publishMqttMessage("pongGame", s);
  }

  serve(){
     this.ballReset();
     STATE = RALLY;
  }

  update(){
   //checkForKeyboardInput(); // moved into controls.
   //checkForServerInput();
   // update field
   this.f.update();
   //console.log("ball v-Y " + this.f.ball.velY);

   // update players
   for (let i = 1; i <=this.playersCount; i ++ ) {
       this.players[i].update();
   }
   //player[2].update();

   // check score
   this.checkForHit();
   this.checkForWin();

   this.drawScore();

 } // end update

drawScore(){

//textFont(scoreFont, 88);
  push();
     fill(scoreColor);
     noStroke();

     if (this.playersCount  == 1) {

       let s = String ("" + this.players[1].getScore() );

       text(s,width-border-textWidth(s)-10,(100+border)); // undefined?
       this.drawPlayerOneName();

     }
     else if (this.playersCount == 2) {

       let s = String ( this.players[1].getScore()  + "   " + this.players[2].getScore());
       text(s,theCanvas.width/2,(100+border));
       this.drawPlayerOneName();
       this.drawPlayerTwoName();
     }
  pop();

  } // end draw score 

  // display draw player names 
  drawPlayerOneName(){

           let pString1 = String(this.players[1].playerName);
     
          //  console.log(this.players[1].playerName);
           push();
            fill(nameColor);
            textSize(40);
            textAlign(LEFT);
            let angle1 = radians(0);
            translate((this.players[1].x), theCanvas.height-25);
            rotate(angle1);
            text(pString1,0,0); //
           pop();

  }

  drawPlayerTwoName(){

           let pString2 = String(this.players[2].playerName);
          //  console.log(this.players[1].playerName);
           push();
            fill(nameColor);
            textSize(40);
            textAlign(RIGHT);
            let angle2 = radians(0);
            translate((this.players[2].x), theCanvas.height-25);
            rotate(angle2);
            text(pString2,0,0); //
           pop();

  }


checkForHit(){
  //console.log("checkforhit");

  let vMax = 20; // was 80 
  let HIT = 1;

   // println("checking");
   // this need to account for width of paddle 
   //  also needs to check speed 

    if (this.f.ball.locX - this.f.ball.ballSize/2  <= this.players[1].x) {
    //  console.log("on player 1 line ");
      // on the goal -- did we hit the paddle
      if (this.players[1].hitTheBall(this.f.ball.locY, this.f.ball.ballSize) ) {
        let s = String ("*"+HIT+",1,#"); // hit by player 1
        publishMqttMessage("pongGame", s);
        this.f.ball.velX *= -1.1;
        if (this.f.ball.velX > vMax) this.f.ball.velX = vMax; // limit xVelocity
      //  console.log("velX = " + this.f.ball.velX);
      } else {
        this.f.ball.locX = -5;
        this.goal(this.f.ball.velX);  // used to be in ball
      }
   }

   if (this.playersCount == 2) {
     // if the ball is on the paddle in terms of X
     if (this.f.ball.locX + this.f.ball.ballSize/2 >= this.players[2].x) {
         //console.log("on the player 2 line");
        if (this.players[2].hitTheBall(this.f.ball.locY, this.f.ball.ballSize) ) {
          let s = String ("*"+HIT+",2,#"); // hit by player 2
          publishMqttMessage("pongGame", s);
          this.f.ball.velX *= -1.1;
          if (this.f.ball.velX > vMax) this.f.ball.velX = vMax;
        } else {
        this.f.ball.locX = width + 5;
        this.goal(this.f.ball.velX); // used to be in ball.
      }
     }
    }

    if (this.playersCount == 1 ) {
     if (this.f.ball.locX + this.f.ball.ballSize/2 >= theCanvas.width - border) {
      // hit side
       this.f.ball.velX *= -1.3;
       hitSound.play();
    }
    }

 } // end checkForHIt // was checkForGoal


 goal(xVel) {
   let A_GOAL = 2;
   let pointGetter = 1;
   if (xVel < 0  && this.playersCount == 2 )  {
     pointGetter +=1; // if the ball was moving left then p 2 scored.
   }
    this.players[pointGetter].score+=1;
    this.lastPoint = pointGetter;
    let s = String ("*"+ A_GOAL + ","+pointGetter+",#");
    publishMqttMessage("pongGame", s);
    STATE = GOAL;

 } // end goal

 checkForWin(){
   let WINNER = 3;
  // println("did i win");
   for(let i=1; i <=this.playersCount; i++){
    // println("checking each player");
    // println(" a score " + player[i].getScore() );
     if ( this.players[i].getScore() >= this.maxScore) {
     //  println("we have a ner");
         this.winner = i;
         STATE = WIN;
         let s = String ("*"+ WINNER + ","+i+",#");
         publishMqttMessage("pongGame", s);
     }//end if
   }// end for
 }// end check


 setSkill( i ) {

   console.log("\t\tin pong.js -- setting skill on pong ... " + (i));
   console.log("player " + this.playersCount);

   for(let j = 1; j <= this.playersCount; j ++ ) {
     this.players[j].setSkill(i); // was i-48 but js now
   }

 } // end set skill

flashWinner(c) { // color

       this.players[this.winner].drawPaddle( c );

 } // end flash

// what -- why is this an input?
setPlayerCount(k){
      k = k - 48;
 }

 ballReset() {
   let edgeFlag = false;
    console.log("last point " + this.lastPoint);
    // cryptic steve 
    let ballX = (this.lastPoint == 1) ? border*2+edgeWidth : width-border*2-edgeWidth;
    this.f.ball.locX = ballX;
    this.f.ball.locY = this.players[this.lastPoint].y+90;

    // does not solve ball served at top edge 
    if ( this.f.ball.locY < border)
      { this.f.ball.locY = border + 20;
        edgeFlag = true;
      }


    let vX = (this.lastPoint == 1) ? 2 : -2;
    this.f.ball.velX = vX;
    if (p.players[this.lastPoint].y > height/2){
      this.f.ball.velY = -1.0; // was 0.5
      this.f.ball.locY = height/2; // fix server steveeeee
    } else {
      this.f.ball.velY = 1.0; // was 0.5
      this.f.ball.locY = height/2; // // fix server steveeeee
    }

     if ( edgeFlag )  {
       //this.f.ball.velY = 1.1;
      // this.f.ball.locY > (theCanvas.height-border)
    }
  }

  softReset() {

    for (let i = 1; i <= this.playersCount; i ++){
          this.players[i].score = 0;
    }

    this.ballReset();

    this.f.drawField();
    //f.drawNet();

     for (let i = 1; i <= this.playersCount; i ++ ) {
          this.players[i].update();
     }

    this.drawScore();
    let s = String ("*4,2,#"); // hit by player 2
    publishMqttMessage("pongGame", s);
  }

  setMaxScore( _mS) {
    this.maxScore = _mS;
  }

  addPlayerConnection(whichPlayer){
    if (whichPlayer == 1){
      playerOneConnected = true;
      this.playersConnected+=1;
    } else if (whichPlayer == 2){
      playerTwoConnected = true;
      this.playersConnected+=1;
    }
  }
  
  updatePlayersConnected(){
    console.log("in pong.getPlayersConnected");
    let tempCount = 0;
    if (this.players[1].getConnectionStatus()){
      tempCount+=1;
      console.log("playerOne is connected");
    }
    if ( this.playersCount == 2 ){
      if (this.players[2].getConnectionStatus()){
        tempCount+=2;
        console.log("playerTwo is now connected");
      }
    }
    console.log("total connected == " + tempCount);
    //
    switch (tempCount){
     case 1 :
      this.playersConnected = 1;
       // only playerOne connected
       if (this.playersCount == 1 ){

         // only need one player
         STATE = SKILL_LEVEL;
       } else {
         console.log("awaiting player 2");
       }
       break;
     case 2:
       // only player 2 connected
       this.playersConnected = 1;
       console.log("awaiting player 1");
       break;
     case 3:
       // both players connected
       if (this.playersCount == 2 ){
         STATE = SKILL_LEVEL;
         console.log("both players connected");
       }
       this.playersConnected = 2;
       break;

    }
    //  STATE = SKILL_LEVEL;
    //  console.log("we have all the expected players");


  }

  setPlayersConnected(_pc){ // idx

    console.log("in pong.setPlayersConnected,\n expected players  ==  "+this.playersCount+
                 "\n connected players = " +_pc);

      this.playersConnected = _pc;


      if (this.playersConnected == this.playersCount) {
        STATE = SKILL_LEVEL;
        console.log("we have all the expected players");
      }
  }


} // end pong
