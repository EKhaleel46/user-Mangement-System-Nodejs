const express = require("express")
const userRoute = express()
const session  = require('express-session')
const config = require('../config/config')
const userController = require("../controllers/userController")
const user = require('../models/userModel')


userRoute.set('view engine','ejs')
userRoute.set('views','./views/users')


userRoute.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}) )

const auth = require("../middleware/auth")

userRoute.get('/register',auth.islogout,userController.loadRegister);
userRoute.post('/register',userController.insertUser);

userRoute.get('/',auth.islogout,userController.loadLogin);
userRoute.post('/',userController.verifyUser)

userRoute.get('/home',auth.islogin,userController.loadHome)
userRoute.get('/logout',auth.islogin,userController.userLogout)


module.exports = userRoute;


// ------------- find user ex
// userRoute.get('/show',(req,res)=>{
//     res.render('show');
// })

// userRoute.post('/show',async(req,res)=>{
//     const usernme = req.body.name1
//     const ur = await user.findOne({name:usernme})
//     if(ur){
//         res.send(ur)
//     }else{
//         res.send('false')
//     }
// })