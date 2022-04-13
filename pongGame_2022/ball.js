class Ball {

  // constructor
  constructor (){
    this.locX = random(0,theCanvas.width);
    this.locY = random(0,theCanvas.height);
    this.velX = 10;//was 100
    this.velY =  1;
    this.ballSize = 20;

  } // end constructor

  update(){
   // println("Ball update");
     this.moveBall();     // method in Ball class
     this.check();
     this.display();
  }

  moveBall(){

    this.locX += this.velX;
    this.locY += this.velY;

  }// end move


  // checks for contact with wall and Paddle
  check(){

    //check for a top or bottom
     if ( (this.locY < ( this.ballSize + 5 + border)) ||
          (this.locY > ( theCanvas.height-this.ballSize-5-border)) ){

       this.velY *= -1;
         hitSound.play();
     }

     // check for on goal line

    if (this.locX < (this.ballSize/2) || (this.locX > theCanvas.width-this.ballSize/2)) {
       p.goal(this.velX);
    }


  }// end check

  display() {
    rectMode(CENTER);
    noStroke();
    fill(ballColor);
    rect ( this.locX, this.locY, this.ballSize, this.ballSize);
    rectMode(CORNER);
  } // end display


} // end Ball class
