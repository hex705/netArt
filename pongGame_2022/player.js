class Player {

  skillScale = 25;

  constructor( _id,  _skill){

    this.x = -10;
    this.y =  0;
    this.skill = _skill;
    this.score = 0;
    this.id    = _id;
    this.s = 0;
    console.log("skill scale in init " + this.skillScale);
    this.skill = _skill*this.skillScale;
        log("skill in init " + this.skill);
    if (this.id == 1) {
        this.x=border+30;
      } else {
        this.x=(width-30-border);
    }

    this.y = theCanvas.height/2 - this.skill/2;

    console.log("Player " + this.id + " created");


  } // end player constructor


  setSkill(s){
    console.log("in players setSkill(), s ==  " + s);
    let temp = 2;
    switch (s) {
      case "1":
        console.log();
        temp = 4;
      break;

      case "3":
        temp = 1;
      break;
    }
    console.log("player.js->setSkill temp = " + temp);
    this.skill = temp * this.skillScale;
    console.log("skill set to " + this.skill);
  }

  update(){
    this.drawPaddle(paddleColor);
  }

  drawPaddle(a,b,c){
    //console.log("drawpaddle skill == " + this.skill);
    stroke(a,b,c); // needs to be a color
    strokeWeight(10);
    line (this.x,this.y,this.x,this.y+this.skill);

  }

  up(){
    //println("up");
    this.y -= 10;
    if (this.y <= 10) this.y = 10;
  }

  down(){
    this.y += 10;
    if (this.y >= height-10-this.skill) this.y = (height-10-this.skill);

  }

  setPaddleHeight(h){  // input can be 0 - 255
     this.y = map (h,0,255, border, theCanvas.height);
  }


  hitTheBall( ballY, bSize ) {
    let hit = false;
    let paddleTop = this.y;
    let paddleBottom = this.y+this.skill;
    console.log("ballY "+ ballY + " paddleTop " + paddleTop + "  sum " + paddleBottom);
   // if ( (ballY+bSize/2 > y) && (ballY+bSize/2 < (y+skill) )) {
    console.log("type of ball y " + typeof ballY);

    if ( paddleTop < ballY+bSize/2 && paddleBottom > ballY-bSize/2) {
      console.log(" in player hit the ball == yup its a hit");
       hitSound.play();
      hit = true;
    } else {
      console.log("player missed");
    }

   return hit;

  }

  getScore(){
    return this.score;
  }

  getX(){
    return this.x;
  }

} // end player
