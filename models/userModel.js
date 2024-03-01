const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        minLength : 4
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 6
    },
    mobile : {
        type : String,
        required : true,
        min : 10
    },
    isAdmin : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model("User", userSchema);