
 const User=require('../models/user')
const crypto=require('crypto')
 
const sendmail=require('../config/sendmail')

module.exports.login=function login(req,res){
  req.flash('success', 'Logged in Successfully');

     
    console.log("login");
    res.render('login');
}

module.exports.signin=function signin(req,res){
    console.log("signin");
 

 res.render("signin")
}

module.exports.logout=function logout(req,res){
  req.flash('success', 'Logged in Successfully');

    console.log("logout");

}

module.exports.forgetpassword=function forgetpassword(req,res){
  console.log("forgetpassword");
  res.render('forgetpassword',{
    forgetpass:true
  });
 // sendmail("fakepass");

}
module.exports.forgetpasswordpost=function forgetpasswordpost(req,res){
  console.log("forgetpasswordpost");
  let fakepass=crypto.randomBytes(5).toString('hex')
  sendmail.main(fakepass,req.body.email);
  let email=req.body.email;
  const newpasshash=encrypt(fakepass,"password");
  var newvalues = { $set: {password: newpasshash} };
 
  User.findOneAndUpdate({email: req.body.email},newvalues).then((user)=>{
    console.log("user "+user);
  })

  var forgetpass=false;
  console.log("eq.forgetpass "+req.forgetpass)
  if(req.forgetpass){
    forgetpass=true;
  }
  res.render('getnewpassword',{
    forgetpass:true
  });

 // res.render('forgetpassword');
 // sendmail("fakepass");

}
module.exports.resetpassword=function resetpassword(req,res){
    console.log("resetpassword");
  res.render("resetpassword")
}

module.exports.resetpasswordpost=function resetpasswordpost(req,res){
  console.log("resetpasswordpost");
  req.logout(function(err) {
     
  });
  
  User.findOne({email: req.body.email}).then(function(user)  {
           
      if (!user ){
          console.log('not found Username/Password');
          res.redirect('./signin')
      }
      else{
      const oripassword=decrypt(user.password,"password");
      if(oripassword !=req.body.oldpassword ){
          console.log("incorrect password")
         // return done(null, false);
         res.redirect('./login')
      }
      else
       {
        console.log("passwor entry");
          const newpasshash=encrypt(req.body.newpassword,"password");
          var newvalues = { $set: {password: newpasshash} };

          console.log("req.body.newpassword "+req.body.newpassword)
          User.findOneAndUpdate({email: req.body.email},newvalues).then((user)=>{
            console.log("user "+user);
            res.render('home',{
              user:user
            })

          })
       }
    }
    })  
   
  }



  //res.render("resetpassword")




module.exports.profile=function profile(req,res){
    
    console.log("rending profile "+req)
    req.flash('success', 'Logged in Successfully');

    res.render('home',{
        user:req.user
    })

}
module.exports.logout=function logout(req,res){
        req.logout(function(err) {
        if (err) { return next(err); }
        res.render('login');
      });

}

module.exports.createUser=function createUser(req,res){
  req.flash('success', 'User create in Successfully');

    console.log("createUser");
    let name=req.body.name;
    let pass=req.body.password;
    let email=req.body.email;

    console.log("createUser ",name+" "+pass+" "+email);

    const newUser = {
        email: req.body.email,    
        password: encrypt(req.body.password,"password"),    
        name: req.body.name    
      };
    User.create(newUser);
    res.render('login')

}

module.exports.home=function home(req,res){
  req.flash('success', 'Logged  in Successfully');

    console.log("home");
    res.render('home',{
        user:req.user
    })

}
const encrypt = (plainText, password) => {
    try {
      const iv = crypto.randomBytes(16);
      const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
      let encrypted = cipher.update(plainText);
      encrypted = Buffer.concat([encrypted, cipher.final()])
      return iv.toString('hex') + ':' + encrypted.toString('hex');
  
    } catch (error) {
      console.log(error);
    }
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