const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const crypto=require('crypto')

 
const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function( req,email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}).then(function(user)  {
           
            if (!user ){
                console.log('not found Username/Password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false,{message: 'nvalid Username/Password'});
            }
            const oripassword=decrypt(user.password,"password");
            if(oripassword !=password ){
                console.log("incorrect password")
                req.flash('error', 'Invalid Username/Password');
                return done(null, false,{message: 'nvalid Username/Password.'})
            }


            return done(null, user);
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id).then(function(user){
        // if(err){
        //     console.log('Error in finding user --> Passport');
        //     return done(err);
        // }

        return done(null, user);
    })
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/user/signin');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

const decrypt = (encryptedText, password) => {
    try {
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
  
      const encryptedData = Buffer.from(textParts.join(':'), 'hex');
      const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      const decrypted = decipher.update(encryptedData);
      const decryptedText = Buffer.concat([decrypted, decipher.final()]);
      return decryptedText.toString();
    } catch (error) {
      console.log(error)
    }
  }

module.exports = passport;