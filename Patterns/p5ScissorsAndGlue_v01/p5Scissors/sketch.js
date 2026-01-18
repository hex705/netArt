// scissors and glue ofr js as classes 
// next step get them into a CDN

let scissors;

let message = "*13,bye,-65.4,no,67.8,12,#";
// index        0 ,1  ,2    ,3 ,4   ,5
// type         i ,s  ,f    ,s ,f   ,i

function setup() {

  scissors = new p5Scissors();

}

function draw() {
 ;
}


function mousePressed(){

  console.clear(); // works in chrome YMMV
  console.log("input message :: " + message);
  
  // parse message 
  scissors.parse(message);

  // extract first 3 elements from message, by index and type
  let myInt_0 = scissors.getInt(0);
  let myString_1 = scissors.getString(1);
  let myFloat_2 = scissors.getFloat(2);

  // debug and test the elements for type:
  console.log("\nFirst three elements of message:: " + myInt_0 + ", " +myString_1+ ", " +myFloat_2);
  console.log(" you can do math to myInt_0: " +  myInt_0 +" add 10 = " + (myInt_0+10));
  console.log(" you can do math to myFloat_2: " +  myFloat_2+" add 10.1 = " + (myFloat_2+10.1));
  console.log(" you can string stuff together,  " + myString_1 + " (myString_1) ");

  // test the number interface
  console.log("\nIn p5js you can extract numbers with the number interface:: ");
  let myOtherFloat = scissors.getNumber(2);  // number is unique to js (not available in arduino) 
  let myOtherInt = scissors.getNumber(0);
  console.log(" you can do math to myOtherFloat: " +  myOtherFloat+" add 10.1= " + (myOtherFloat+10.1));
  console.log(" you can do math to myInt_0: " +  myOtherInt +" add 10= " + (myOtherInt+10));

  // create some errors? 
  console.log("\nError check:: ");
  myString_1 = scissors.getString(1);
  console.log("No math to STRINGS.  String from index 1: " +myString_1 + ", add 10= " + myString_1+10);

  myInt_1 = scissors.getInt(1); // pos 1 holds a string 
  console.log("Get an INT, store it in a STRING by mistake then add 10= " + myInt_1+10);

  console.log("\nTry to get an element with an out of range index (9)");
  let test = scissors.getInt(9);
  console.log ("asked for out of range value 9, got:: "+ test);

}

