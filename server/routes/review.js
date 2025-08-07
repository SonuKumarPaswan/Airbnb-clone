const express=require("express");
const router = express.Router({ mergeParams: true });
const Listing=require("../models/listing")
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {listingSchema , reviewSchema}=require("../schema.js");
const Review = require("../models/review.js")



// handle middleware request for reviews Schema ( Database validation handle )
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    console.log(error)
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    console.log(errMsg)
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }
}

// Review
// Post Routes 
router.post("/",validateReview, wrapAsync(async(req,res)=>{
  let listing= await  Listing.findById(req.params.id)
  let newReview= new Review(req.body.review)
  listing.reviews.push(newReview);
  await newReview.save()
  await listing.save()
    req.flash("success","New review Created!")
  res.redirect(`/listings/${listing._id}`)
}))

// Delete review route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // console.log(id,reviewId)
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports=router;