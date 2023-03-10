const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('assets'));
const db = require('./config/mongoose');

// Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// use express router

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || "connect-mongodb setup ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
// use express router
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server ${err}`);
    }
    else {
        console.log(`Server is running 🚀🚀 on port ${port}`);
    }
});