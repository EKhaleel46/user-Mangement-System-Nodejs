const Admin = require('../models/userModel');
const bcrypt = require('bcrypt')
const randomString = require('randomstring');
const User = require('../models/userModel');

const loadAdmin = async (req,res)=>{
    try{
        res.render('login')
    }catch(e){
        console.log(e.message)
    }
}

const verifyLogin = async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const AdminData = await Admin.findOne({email:email})
        
        if(AdminData){

            const passwordMatch = await bcrypt.compare(password, AdminData.password)

            if(passwordMatch){
                if(AdminData.isAdmin === 0){
                    res.render('login',{message:'Unauthorized User'})
                } else {
                    req.session.Admin_id = AdminData._id;
                    res.redirect('admin/Dashboard')
                }
            } else {
                res.render('login',{message:'Incorrect Email or Password'})
            }

        }else{
            res.render('login',{message:'Incorrect Email or Password'})
        }

    }catch(e){
        console.log(e.message);
    }
}

const loadDashboard = async (req,res)=>{
    try{
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
        const limit = 2

        const usersData = await Admin.find({
            isAdmin:0,
            $or:[
                {name: {$regex: '.*'+ search +'.*', $options: 'i'}},
                {email: {$regex: '.*'+ search +'.*', $options: 'i'}},
                {mobile: {$regex: '.*'+ search + '.*', $options: 'i'}}
            ]
        });

        res.render('Dashboard',{users:usersData})
    }catch(e){
        console.log(e.message);
    }
}

const adminLogout = async (req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }catch(e){
        console.log(e.message);
    }
}

const newUserLoad = async (req,res)=>{
    try{
        res.render('addNewUser')
    }catch(e){
        console.log(e.message);
    }
}

const securePassword = async (password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    }catch(e){
        console.log(e.message);
    }
}

const newUserAdd = async (req,res)=>{
    try{
        const name = req.body.name
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = req.body.password;

        const Spassword = await securePassword(password)

        const user = new User({
            name : name,
            email : email,
            mobile : mobile,
            password : Spassword,
            isAdmin : 0
        })

        const UserData = await user.save()

        if(UserData){
            res.redirect('/admin/Dashboard')
        }else{
            res.render('addNewUser',{message : 'something went wrong'})
        }

    }catch(e){
        console.log(e.message);
    }
}

const userEditLoad = async (req, res) => {
    try{
        const id = req.query.id;
        const UserData = await User.findById({ _id:id });
        if(UserData){
            res.render('editUser',{ user:UserData});
        } else {
            res.redirect('/admin/Dashboard')
        }
    }catch(e){
        console.log(e.message);
    }
}

const updateUser = async (req, res) => {
    try{
        const UserData = await User.findByIdAndUpdate({_id : req.body.id}, { $set : {name : req.body.name, email : req.body.email, mobile : req.body.mobile }})
        if(UserData)res.redirect('/admin/Dashboard');
    }catch(e){
        console.log(e.message);
    }
}

const deleteUser = async (req,res) => {
    try{
        const id = req.query.id;
        const deleted = await User.deleteOne({ _id:id });        
        if(deleted)res.redirect('/admin/Dashboard')
    }catch(e){
        console.log(e.message);
    }
}

module.exports = {
    loadAdmin,
    verifyLogin,
    loadDashboard,
    adminLogout,
    newUserLoad,
    newUserAdd,
    userEditLoad,
    updateUser,
    deleteUser
}