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

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Room App</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }

        .card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        h1 {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }

        p {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 25px;
        }

        button {
          padding: 12px 26px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          background: #fff;
          color: #764ba2;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        button:hover {
          background: #f1f1f1;
          transform: translateY(-2px);
        }

        footer {
          margin-top: 20px;
          font-size: 0.85rem;
          opacity: 0.7;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>👋 Hi, I am Room</h1>
        <p>Welcome to your Express.js application.<br/>Server is running successfully 🚀</p>
        <button onclick="alert('Server is working fine ✅')">
          Check Status
        </button>
        <footer>
          Built with ❤️ using Node & Express
        </footer>
      </div>
    </body>
    </html>
  `);
});



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
