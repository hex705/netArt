// scissors and glue ofr js as classes 
// next step get them into a CDN

let glue;
let scissors;

function setup() {
  glue = new p5Glue();
  scissors = new p5Scissors();
}

function draw() {
 ;
}


function mousePressed(){

  // create a message suing function below... 
let m = createMessageLocal(-12,"hi",34.5);
let M = glue.createMessage(13,"bye",-65.4,"no",67.8,12);
console.log(m);
console.log(M);

scissors.parse(M);  // p is an array of elements
let myInt_0 = scissors.getInt(0);
let myString_1 = scissors.getString(1);
let myFloat_2 = scissors.getFloat(2);
let myOtherFloat = scissors.getNumber(2);
let myOtherInt = scissors.getNumber(0);


console.log("Got " + myInt_0 + ", " +myString_1+ ", " +myFloat_2);
console.log(" you can do math to myInt_0: " +  myInt_0 +" add 10= " + (myInt_0+10));
console.log(" you can do math to myFloat_2: " +  myFloat_2+" add 10.1= " + (myFloat_2+10.1));
console.log(" you can string stuff to  " + myString_1 + " (myString_1) ");

// test teh number interface
console.log(" you can do math to myOtherFloat: " +  myOtherFloat+" add 10.1= " + (myOtherFloat+10.1));

console.log(" you can do math to myInt_0: " +  myOtherInt +" add 10= " + (myOtherInt+10));

// create some errors? 
myString_1 = scissors.getFloat(1);
console.log("no math to strings string +10 " +" add 10= " + myString_1+10);

myInt_1 = scissors.getInt(1); // pos 1 holds a string - hi
console.log("no math to strings string +10 " +" add 10= " + myInt_1+10);

let test = scissors.getInt(9);
console.log ("asked for out of range value 9, got:: "+ test);


}


function createMessageLocal (first,second,third){
     // send values to arduino
     // glue is a GLUE object ! 
 glue.create();
 glue.add(first);
 glue.add(second);
 glue.add(third);
 glue.end();

 return glue.get(); // gets a string and returns it 

}