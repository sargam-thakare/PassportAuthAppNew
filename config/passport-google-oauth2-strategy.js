 const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

 
// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: process.env.CLIEND_ID,
         clientSecret : process.env.CLIEND_SECRET,
        callbackURL:process.env.callbackURL,
    },

    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).then(function( user){
         //   if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){               
                 console.log(" iuse found");

                // if found, set this user as req.user
                return done(null, user);
            }else{
                console.log(" not found, create the user and set it as req.user");
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }).then(function(user){
                  //  if (err){console.log('error in creating user google strategy-passport', err); return;}
                  console.log("user created ");

                    return done(null, user);
                });
            }

        }).catch((err)=>{
                    console.log('error in google strategy-passport', err);
                     return;

        }); 
    }


));


module.exports = passport;
