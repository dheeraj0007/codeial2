const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeialDev');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'Error while connecting to DB'));
db.once('open',function(){
    console.log("Successfully connected to DB");
})

module.exports = db;