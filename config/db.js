

const mongoose=require('mongoose')


  mongoose.connect(process.env.MONGODB_CONNECT_URL); 
 //mongoose.connect( "mongodb://127.0.0.1:27017/StudentDB")
  
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

  

module.exports=db;