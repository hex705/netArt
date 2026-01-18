class Field {

  constructor (numPlayers, s){
      this.numberOfPLayers = numPlayers;
      this.ball = new Ball();
      this.border = 100; // 100 
      this.edgeWidth = 12;
      this.netWidth = 10;
      this.update();
      console.log("field inititalized");
  }

  update(){
    this.drawField();

    if (STATE == SERVE || STATE == RALLY ){
       this.ball.update();
    }
  }


  drawField(){

    background(fieldColor);

    if ( this.numberOfPLayers == 2) {
    
      // drawNet
      strokeWeight(this.netWidth);
      stroke(netColor);
      let dashSize = 10;
      let dashStart = 40; // really interval-size so 10 here

      //let numberOfDashes = height-2*border/dashInterval;
      for (let i = this.border; i < theCanvas.height-this.border-dashSize/2; i=i+dashStart){
        let bottomDash = i+dashSize;
        if (bottomDash > (height-this.border)) bottomDash = theCanvas.height-this.border;
        line (theCanvas.width/2, i,theCanvas.width/2,bottomDash);
      } // end for
    } // end if

    stroke(wallColor);
    strokeWeight(edgeWidth);
    fill(wallColor);
     // top
     line(border,border,width-border,border);
     //bottom
     line(border,height-border,width-border,height-border);

     if ( this.numberOfPLayers == 1) {
       // draw right side as solid
       line(width-border,border,width-border,height-border);
     }

  } // end draw

} // end class
