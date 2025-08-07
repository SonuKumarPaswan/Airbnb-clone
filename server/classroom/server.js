const express = require('express')
const app = express()
const users=require("./routess/user")
const posts=require("./routess/post")
const cookieParser = require('cookie-parser')
const session=require("express-session")
const flash=require("connect-flash");
const path=require("path");

const port = 3000

/****** *
app.use(cookieParser())

app.get("/setcookies", (req, res) => {
  res.cookie("name", "Sonu");
  res.send("Name cookie set");
});

app.get("/getcookies", (req, res) => {
  res.cookie("greet", "namaste"); // sets greet cookie
  let { name } = req.cookies;
  console.log(name);              // logs 'Sonu' if set earlier
  res.send("Cookies");
});


// User router
app.use("/users", users)

// post router
app.use("/posts", posts)


***************/

const sessionOptions={
  secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))


// app.get("/reqcount",(req,res)=>{

//     if(req.session.count){
//       req.session.count++;
//     }else{
//       req.session.count=1;
//     }
//   res.send(`you sent the request ${req.session.count} time`);
// })
app.use((req,res,next)=>{
  res.locals.succMgs=req.flash("success")
  res.locals.errorMgs=req.flash("error")
  next();
})

app.get("/register",(req,res)=>{
   let {name="anonymous"}=req.query;
    req.session.name=name;
    // req.flash("successs","user register successfully! ")
    if(name === "anonymous"){
      req.flash("error","User not register !")
    }else{
      req.flash("success","User register successfully!")
    }
   res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
  res.render("page.ejs",{ name: req.session.name});
})

app.get('/test', (req, res) => {
  res.send('Test successful! ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
