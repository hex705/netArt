// https://www.youtube.com/watch?v=wxbQP1LMZsw

// a very simple express Server
// listens on port 3000
// serves static files from folder (directory) public

let express = require("express");
let app = express();
app.listen(3000, ()=> console.log('listening on 3000'));
app.use(express.static('someFolder'));
