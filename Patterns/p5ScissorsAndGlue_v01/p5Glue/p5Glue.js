class p5Glue {

  constructor(_sb = "*", _eb = "#", _de = ","){
       this.glueMessage = "";
       this.START_BYTE = _sb;
       this.END_BYTE = _eb;
       this.DELIMITER = _de;
  } 

  create(){
    this.clear();
    this.glueMessage +=this.START_BYTE;
  }

  // unique to .js because of its willingness to let any variable go anywhere
  // it is wonderfully powerful ... needs testing to makse sure not error prone. 

  createMessage(){

     this.create();

     for (let i= 0; i < arguments.length; i ++){
       this.add(arguments[i]);
     }

     this.end();
     return this.glueMessage; 
  }

  clear(){
    this.glueMessage=""; 
  }

  add(value){
      this.glueMessage+= value;
      this.glueMessage+=this.DELIMITER ;
  }

  end(){
    this.glueMessage+=this.END_BYTE; 
  }

  get(){
    return this.glueMessage;
  }

  send(){
    console.log('send');
  }

  show(){
    console.log("glueMessage:: " + this.glueMessage);
  }

  setEndByte(eb){
    // eb must be a single char
       this.END_BYTE = eb;
  }

  setStartByte(sb){
    // eb must be a single char
       this.START_BYTE = sb;
  }

  setDelimiter(de){
    // eb must be a single char
       this.DELIMITER = de;
  }

  getEndByte(){
    // eb must be a single char
       return this.END_BYTE;
  }

  getStartByte(){
    // eb must be a single char
       return this.START_BYTE;
  }

  getDelimiter(){
    // eb must be a single char
       return this.DELIMITER;
  }


} // end class
