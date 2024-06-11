import express from "express";
import { User } from "./db"
import passport from "./passport-config";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
const router=express.Router();

declare module 'express-session' {
  interface Session {
    signup?: boolean;
  }
}

// Login route
router.get(
  "/auth/google",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google-login", { failureRedirect: "http://localhost:5173" }),
  (req, res) => {
    if (req.user) {
      res.redirect("http://localhost:5173/dashboard");
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
  (req, res) => {
    if (req.user) {
      res.redirect("http://localhost:5173/dashboard");
    } else {
      res.redirect("http://localhost:5173");
    }
  }
);









router.post("/sign",async(req:Request,res:Response)=>{
 const existinguser=await User.findOne({
  userName:req.body.userName
 });

if(existinguser){
  return res.status(400).json({message:"account already exist"});
};

const creatUser=await User.create({
  userName:req.body.userName,
  password:req.body.password
})
const userId=creatUser._id;
return res.status(200).json({message:"account created"})

})

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


  const token=jwt.sign({userId:check._id},"token")
  return res.json({message:"login to page",
    token:token
  })
})



// router.put("/update-pass",async(req,res)=>{
//   const{currentPassword,newpassword}=req.body

//   if(!currentPassword||!newpassword){
//     return res.status(400).send("current and new assword are required");
//   };


//   const User=await user.findById(req.body.password._id) 
//   if(!User){
//     return res.send("user not fond");
//   };

// })








export default router;