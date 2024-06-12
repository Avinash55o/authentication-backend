import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    userName: String,
    displayName:{type:String,
        unique:true
    },
    googleId:String,
    email:{type:String,
        unique:true
    },
    password:String
})

export const User = mongoose.model("authuser",userSchema);


