class p5Scissors {

    constructor(_sb = "*", _eb = "#", _de = "," , _me=8){
         // message structure for parsing
         this.scissorsMessage = "";
         this.START_BYTE = _sb;
         this.END_BYTE = _eb;
         this.DELIMITER = _de;
         this.MAX_ELEMENTS = _me;
         // utility variables
         this.payloadElements = [this.MAX_ELEMENTS]; // 8 data points per message

    } 
  
   parse(payloadString){
    // parse the incoming string to extract data
    // clean incomming payload  (string)
    // unpack the payload - its a string of form [*,data,data,#]
    // work with a copy incase it all goes wrong -- you still have original. 
    let currentString = payloadString;
    trim(currentString); // remove white space
    if (!currentString) return; // if empty
    let displayData = currentString; // for display

    // split the payload into an array
    // there will only be an elements[0] at end
    this.payloadElements = currentString.slice(1); // remove start byte
    this.payloadElements = this.payloadElements.toString().split(this.DELIMITER); // split on commas
    
    return this.payloadElements; // send the array back 
    // the string is now broken into an array
    // we can pull its elements -- until a new message arrives and replaces everything
   }

   getToken( whichOne){
     // generic -- needed? 
   }

   getString(whichOne){
        // error check that whichone is a number and in range
        if ( this.checkIndex(whichOne) ) {
            return String(this.payloadElements[whichOne]);
        }
   }

   getInt(whichOne){
        // error check that whichone is a number and in range
        if ( this.checkIndex(whichOne) ) {
            return Number(this.payloadElements[whichOne]);
        }
   }

   getFloat(whichOne){
        // error check that whichone is a number and in range
        if ( this.checkIndex(whichOne) ) {
           return Number(this.payloadElements[whichOne]); // float is a p5js type!!
        }
   }

   getNumber(whichOne){
    // error check that whichone is a number and in range
        if ( this.checkIndex(whichOne) ) {
        return Number(this.payloadElements[whichOne]);
        }
  }
   


   checkIndex(whichOne){
    let testState = false;
    if (typeof whichOne === "number"){
        if ((whichOne >=0) && (whichOne <= this.MAX_ELEMENTS-1)) {
            testState = true;
        }
    }
    if ( testState == false) 
        console.log("in p5Scissors:: index NAN or out of range");

    return testState;
   }


    create(){
      this.clear();
      this.glueMessage +=this.START_BYTE;
    }
  
    clear(){
      console.log("clear");
      this.glueMessage=""; // trim()
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
  