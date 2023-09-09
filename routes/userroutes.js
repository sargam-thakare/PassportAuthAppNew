
const express=require('express');
const app=express();
const usercontroller=require('../controllers/userController')
const router = express.Router()
const passport=require('passport')


console.log("router userroutesss")

 
 router.get('/signin',usercontroller.signin)
 router.get('/login',usercontroller.login)
 router.post('/profile', passport.authenticate(
    'local',
    {failureRedirect: '/user/signin',
    failureFlash : true},
 ),
usercontroller.profile
)
 router.post('/createUser',usercontroller.createUser)
 router.get('/home',usercontroller.home)
 router.get('/logout',usercontroller.logout)
 router.get('/resetpassword',usercontroller.resetpassword)
 router.post('/resetpassword',usercontroller.resetpasswordpost)
 router.get('/forgetpassword',usercontroller.forgetpassword)
 router.post('/forgetpasswordpost',usercontroller.forgetpasswordpost)


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/user/signin'}),
 usercontroller.home);


 console.log("router userroutesss22222222")
module.exports = router ;
