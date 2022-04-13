// generalize this -- once it works

//
// function playerOneConnect( s, val ) {
//   // these are globals
//   playerIndex = 1;
//   playerType = s;
//   playerMove = val;
//
//   if ( !playerOneConnected ) {
//       playerCount++;
//       p.setPlayersConnected(1);
//       playerOneConnected = true;
//       console.log("connecting player 1");
//       // maybe move name to here?
//     }
//
//   doSomething();
// }
//
// function playerTwoConnect( s, val ) {
//
//     playerIndex = 2;
//     playerType = s;
//     playerMove = val;
//
//   if ( !playerTwoConnected ) {
//       playerCount++;
//       p.setPlayersConnected(2);
//       playerTwoConnected = true;
//       // move name to here ?
//     }
//     doSomething();
// }
//
//
// // /* incoming osc messages are forwarded to the oscEvent method. */
// // void oscEvent( OscMessage theOscMessage ) {
// //   println( " a message");
// //    if( theOscMessage.isPlugged()==false ) {
// //       println( " You onnected but are not plugged!  Check your addresspattern " ) ;
// //       if (theOscMessage.addrPattern().equals("/playerOne")) {
// //         //connect playerOne
// //         println("player one is trying to connect");
// //         playerOne("CONNECT", 0);
// //       }
// //
// //       if (theOscMessage.addrPattern().equals("/playerTwo")) {
// //         //connect playerTwo
// //         playerTwo("CONNECT", 0);
// //       }
// //
// //    }
// //
// // }
//
// function doSomething() {
//
//   // determine the move
//   if (playerIndex > 0 ) { // make sure we have a player
//     p.players[playerIndex].setPaddleHeight( playerMove ) ;
//   }
//     // //console.log(playerMove);
//     //
//     // if (playerType=="DIGITAL") {
//     //   // digital stuff
//     //
//     //   switch ( playerMove ) {
//     //   case -1:
//     //     // down
//     //     p.player[playerIndex].down();
//     //
//     //     break;
//     //
//     //   case 1:
//     //     // up
//     //     p.player[playerIndex].up();
//     //
//     //     break;
//     //
//     //   case 0:
//     //     // hold in place
//     //
//     //
//     //     break;
//     //   default:
//     //     if ( DEBUG) {
//     //       console.log("ERR::  invalid move");
//     //     }
//     //     break;
//     //   } // end switch
//     // } // end if
//
//   //  if (playerType=="ANALOG") {
//
//
// //  }// end make sure player
// } // update -- did we get new info
