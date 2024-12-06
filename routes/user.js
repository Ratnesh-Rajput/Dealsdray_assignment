const {Router} = require("express");
const User = require("../models/user");

const router=Router();

router
.route('/signin')
.get((req,res)=>{
    return res.render("signin");
})
.post(async(req,res)=>{
    const {email,password}=req.body;
   try{
    const token= await User.matchPasswordandGenerateToken(email,password);
        
    return res.cookie("token",token).redirect("/");
   }
   catch(err){
    return res.render("signin",{
        error:"Incorrect Email or Password",
    });
   }
});

router
.route('/signup')
.get((req,res)=>{
    return res.render("signup");
})
.post(async(req,res)=>{
    const {fullName, email, password}=req.body;
    await User.create({
        fullName:fullName,
        email:email,
        password:password
    });
    res.redirect("/");
})

router
.route("/logout")
.get((req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
});

module.exports=router;