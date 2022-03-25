let express = require("express");

let app = express();

app.listen(3001, ()=> { console.log('listening on 3001')});

app.use(express.static('public'));
