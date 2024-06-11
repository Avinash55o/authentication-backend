import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    userName: String,
    googleId:String,
    email:String,
    password:String
})

export const User = mongoose.model("authuser",userSchema);


