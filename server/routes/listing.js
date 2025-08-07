 const express=require("express");
 const router=express.Router();
 const Listing=require("../models/listing")
 const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {listingSchema , reviewSchema}=require("../schema.js");



// handle middleware request for listing Schema (database validatoin handle)
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




router.get("/",  wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing})
}))


// New Routes 
router.get("/news",(req,res)=>{
    res.render("listings/new.ejs");
})
router.post("/", validateListing ,  wrapAsync(async (req,res,next)=>{
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
}))


// Edit routes
router.get("/:id/edit",wrapAsync(async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))
 router.put("/:id", validateListing ,wrapAsync(async(req,res)=>{
      let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing Updated!")
    res.redirect(`/listings`) 
}))



// delete routes
router.delete("/:id",wrapAsync( async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
     req.flash("success","Listing deleted!")
    res.redirect("/listings")
}))


// show routes 
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({
    path: "reviews",
    options: { sort: { createdAt: -1 } } // latest reviews first
  });

  if(!listing){
    req.flash("error","Listing you requested  for doesn't exist ")
    throw new ExpressError(404,"Page not found")
    res.redirect("/listings")
  }
    res.render("listings/show.ejs",{listing})
    console.log(listing)
}))

module.exports=router;