const User = require("../models/userModel")
const bcrypt = require("bcrypt")


const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10) 
        return passwordHash
    }catch(error){
        console.log(error.message)
    }
}

const loadRegister = async (req,res)=>{
    try{
        res.render('registration')
    }catch(error){
        console.log(error.message)
    }
}

const insertUser = async (req,res)=>{
    try{
        const scdPassword = await securePassword(req.body.password)

        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : scdPassword,
            mobile : req.body.mobile,
            isAdmin : 0 
        });
        const userData = await user.save()
        if(userData){
            req.session.user_id = userData._id
            res.redirect('/home')
        } else {
            res.render('registration',{message:"your registration failed"})
        }
        
    }catch(error){
        console.log(error.message)
    }
}

const loadLogin = async (req,res)=>{
    try{
        res.render('login')
    }catch{(error)
        console.log(error.message)
    }
}

const verifyUser = async (req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password

        const UserData = await User.findOne({email:email})

        if(UserData){
            const passwordMatch = await bcrypt.compare(password, UserData.password)
            if(passwordMatch){
                req.session.user_id = UserData._id;
                res.redirect('/home')
            }else{
                res.render('login',{message:"Incorrect Email or Password"})
            }
        }else{
            res.render('login',{message:"Incorrect Email or Password"})
        }

    }catch(e){
        console.log(e.message)
    }
}

const loadHome = async (req,res)=>{
    try{
        const userData = await User.findById({ _id : req.session.user_id })
        res.render('home',{ user : userData})
    }catch(e){
        console.log(e.message)
    }
}

const userLogout = async (req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(e){
        console.log(e.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    verifyUser,
    loadHome,
    userLogout
}