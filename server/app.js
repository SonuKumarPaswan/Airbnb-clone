const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema}=require("./schema.js");
const { error } = require("console");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log("database connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")))


app.get("/",(req,res)=>{
    res.send("Hi, i am room")
})

// handle middleware request for Schema (database validatoin handle)
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    console.log(error)
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }
}

app.get("/listings",  wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing})
}))


// New Routes 
app.get("/listings/news",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings", validateListing ,  wrapAsync(async (req,res,next)=>{
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}))

// Edit routes
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findById(id);
    console.log(listing)
    res.render("listings/edit.ejs",{listing})
}))

 app.put("/listings/:id", validateListing ,wrapAsync(async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // console.log(listing)
    res.redirect(`/listings`) 
}))
// delete routes
app.delete("/listings/:id",wrapAsync( async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))
// show routes 
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    console.log(listing)
}))


// app.get("/testListing", async (req,res)=>{
//     const sampleListing=new Listing({
//         title:"My new Villa",
//         description:"by the beach",
//         price:1200,
//         location:"Calangute, Gao",
//         country:"India"
//     })
//     res.send("data send")
//     const  a=await sampleListing.save();
//    console.log(a)
// })

// // Catch-all route for undefined paths
// app.all("*", (req, res, next) => {
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
