-- this is a basic bridge to let an UNO connect to PONG

-- it can be generalized.

-- topology :

circuit --> UNO --> serial --> p5 serial control --> browser --> shiftr

Serial message is of form [*, playerMove,#]
this string is simply forwarded to ::
shiftr with topic --> playerOne or player Two

the .js files NEED to be running in a browser -- even though they are not particularly interesting. 
