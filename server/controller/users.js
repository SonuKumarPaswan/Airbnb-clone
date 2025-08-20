const passport = require("passport");
const User=require("../models/users");

module.exports.renderSignup=(req,res)=>{
    res.render("./user/signup");
}

module.exports.signup = async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings")
        })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm= (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login= async(req,res)=>{
        req.flash("success","Welcome back to wanderlust! ")
        let redirectUrl=res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    }
    
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logout!")
        res.redirect("/listings")
    })
}
