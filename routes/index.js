
const express=require('express');
 
const router = express.Router()

console.log("router started")
router.use('/user',require('./userroutes'));
console.log("router ended")


router.get('/',function(req,res){
console.log("hellowindex")
})

module.exports = router ;
