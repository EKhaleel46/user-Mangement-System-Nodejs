const express = require('express')
const adminRoute = express()
const session = require('express-session')
const config = require('../config/config')
const adminController = require('../controllers/adminController')


adminRoute.set('view engine','ejs');
adminRoute.set('views','./views/admin')



adminRoute.use(session({
    secret : config.sessionSecret,
    resave:true,
    saveUninitialized:true
}) )

const adminAuth = require('../middleware/adminAuth')

adminRoute.get('/',adminAuth.islogout,adminController.loadAdmin)
adminRoute.post('/',adminController.verifyLogin);

adminRoute.get('/Dashboard',adminAuth.islogin,adminController.loadDashboard);
adminRoute.get('/logout',adminAuth.islogin,adminController.adminLogout)

adminRoute.get('/newUser',adminAuth.islogin,adminController.newUserLoad);
adminRoute.post('/newUser',adminController.newUserAdd);

adminRoute.get('/editUser',adminAuth.islogin,adminController.userEditLoad);
adminRoute.post('/editUser',adminController.updateUser);

adminRoute.get('/deleteUser',adminController.deleteUser);

module.exports = adminRoute;