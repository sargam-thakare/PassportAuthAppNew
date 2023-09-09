const express=require('express')
require('dotenv').config();

const passport=require('passport')
const path=require('path')
const app=express();
const db=require('./config/db')
const port=8080
const passportlocal=require('./config/passportconfig')
const cookieParser = require('cookie-parser');
const session = require('express-session');
 const crypto=require('crypto')
 const passportGoogle = require('./config/passport-google-oauth2-strategy');
 var flash = require('connect-flash');
 const customMware = require('./config/flashmiddle');
 
app.use(express.urlencoded());

 
 app.use(express.static('./assets'));
 
app.set('view engine','ejs')
app.set('views','./views')
app.use(cookieParser());

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


 app.use('/',require('./routes'));


// app.use('/login',function(req,res){

// res.render('login');
// })
app.listen(port,function(){
    console.log("server is running on port 8080 ")
})


