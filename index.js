const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/user_management_system");

const express = require("express");
const app = express();
const path = require('path')
const session = require("express-session");
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');


const { sessionSecret } = require("./config/config");
const nocache = require('nocache');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(nocache());

app.use(express.static(path.join(__dirname,'public')))

app.use('/',userRouter);
app.use('/admin',adminRouter);


app.listen(4003,()=>console.log("server started"))