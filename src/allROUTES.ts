import express from "express";
import { User } from "./db"
import passport from "./passport-config";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const router=express.Router();

declare module 'express-session' {
  interface Session {
    signup?: boolean;
  }
}

interface IUser {
  email?: string;
  userName?: string;
  googleId?: string;
  password?: string;
  displayName?: string;
}


// Login route
router.get(
  "/auth/google",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

function isUser(user: any): user is IUser {
  return user && typeof user.userName === 'string';
}

router.get(
  "/auth/google/callback",
  passport.authenticate("google-login", { failureRedirect: "http://localhost:5173" }),
  (req, res) => {
   
    if (isUser(req.user) && req.user.userName) {
      res.redirect(`http://localhost:5173/dashboard?username=${encodeURIComponent(req.user.userName)}`);
    } else {
      res.redirect("http://localhost:5173");
    }
  }
);

// Signup route
router.get('/signup', (req, res) => {
  req.session.signup = true;
  res.redirect('/auth/google/signup');
});

router.get(
  "/auth/google/signup",
  passport.authenticate("google-signup", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/signup/callback",
  passport.authenticate("google-signup", { failureRedirect: "http://localhost:5173" }),
  (req, res,profile:any) => {
    if (req.user) {
      
      res.redirect(`http://localhost:5173/dashboard?username=${encodeURIComponent(profile.userName)}`);
    } else {
      res.redirect("http://localhost:5173");
    }
  }
);








//NORMAL SI
router.post("/sign",async(req:Request,res:Response)=>{
 const existinguser=await User.findOne({
  userName:req.body.userName
 });

if(existinguser){
  return res.status(400).json({message:"account already exist"});
};

const creatUser=await User.create({
  userName:req.body.userName,
  email:req.body.email,
  password:req.body.password
})
const userId=creatUser._id;
return res.status(200).json({message:"account created"})

})


// NORMAL LOGIN ROUTER
router.post("/login" ,async(req,res)=>{
  const existinguser=await User.findOne({
    userName:req.body.userName
  });
  if(!existinguser){
    return res.status(400).json({
      message:"please signup!"
    });  
  }


  const check= await User.findOne({
    userName:req.body.userName,
    password:req.body.password
  })
  if(!check){
    return res.status(411).json({
      message:"invalid credentials"
    })
  };


  const token=jwt.sign({username:check.userName},"token")

  return res.json({message:"login to page",
    token:token
  })
})





router.put("/update-pass",async(req:Request,res:Response)=>{
  const{userName,newpassword}=req.body

  if(!userName||!newpassword){
    return res.status(400).send("userName and new assword are required");
  }


  const user=await User.findOne({userName}) 
  if(!user){
    return res.status(400).send("username not found");
  }
  
  const HashPassword=await bcrypt.hash(newpassword,10);

  user.password=HashPassword;
  await user.save();
  
  return res.status(200).json({password:HashPassword,message:"password changed"});
});


router.get("/profile/:userName",async(req:Request,res:Response)=>{
  const {userName}=req.params;

  const user= await User.findOne({userName})

  if(user){
    res.json(user);
  }else{
    res.status(404).json({message:"profile not found"})
  }



})








export default router;