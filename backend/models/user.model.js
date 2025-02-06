const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        mail:{
            type:String,
            required:true,
            unique:true
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
        password: {
            type:String,
            required:true,
        }
    }
);

const User = mongoose.model("User",UserSchema);

module.exports = User;

