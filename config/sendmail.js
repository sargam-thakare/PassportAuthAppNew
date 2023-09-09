
const nodemailer = require("nodemailer");

 
const transporter = nodemailer.createTransport({
   
    service: 'gmail',
   
    auth: {
        
            user: process.env.username,
            pass: process.env.pass
        
    }
});

exports.main= async function (password,email) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"sargammm" <${process.env.emailfrom}>`, // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Hello user your new password is ${password}</b>`, // html body
    },function(err,data){
        console.log("err ",err);
        console.log("data ",data);

    });
  
 //   console.log("Message sent: %s", info.messageId);

}

// main(password).catch(console.error);


// module.exports.main=main