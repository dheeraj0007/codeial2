const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port  = 8000;
const db = require('./config/mongoose');
app.use(express.urlencoded());
app.use(cookieParser());
// use express router
app.use('/',require('./routes/index'));

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,(err)=>{
    if(err){
        console.log(`Error in running the server ${err}`);
    }
    else{
        console.log(`Server is running 🚀🚀 on port ${port}`);
    }
});