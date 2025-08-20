if(process.env.NODE_ENV != "production"){
 require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema , reviewSchema}=require("./schema.js");
const session=require("express-session")
const MongoStore = require('connect-mongo');
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
const flash=require("connect-flash");


// authentication 
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User = require('./models/users');
const { register } = require("module");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const DBUser=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("database connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(DBUser);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")))


const store=MongoStore.create({
    mongoUrl:DBUser,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE")
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }
}

// app.get("/",(req,res)=>{
//     res.send("Hi, i am room")
// })



app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser", async(req,res)=>{
//     let fakeUser=new User({
//         email:"sonupaswan0381@gmail.com",
//         username:"Name"
//     })
//     let registeredUser= await User.register(fakeUser,"Helloworl");
//     res.send(registeredUser)
//     console.log(registeredUser)
// })


app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/", userRouter)



// Catch-all route for undefined paths
// app.all("*", (req, res, next) => {
//     // throw new ExpressError(404,"Page not found!")
//    next(new ExpressError(404, "Page not found"));
// });


// Global error-handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("listening port on 8080")
})
