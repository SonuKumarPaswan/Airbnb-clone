const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError');
const {listingSchema , reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl)
        req.flash("error","you must be logged in to create Listing");
       return res.redirect("/login")
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl)
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl)
    }
    next();
}


module.exports.saveOwner= async(req,res,next)=>{
     let {id}=req.params;
      let listing= await Listing.findById(id);

     // If listing doesn't exist
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Authorization check
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listings");
        return res.redirect(`/listings/${id}`);
    }
    next()
}

// handle middleware request for listing Schema (database validatoin handle)
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    console.log(error)
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }
}

// handle middleware request for reviews Schema ( Database validation handle )
 module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    console.log(error)
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    console.log(errMsg)
    throw new ExpressError(400 , errMsg);
   }else{
    next();
   }
}
module.exports.isReviewAuthor= async(req,res,next)=>{
     let {id,reviewId}=req.params;
      let review= await Review.findById(reviewId);
    // Authorization check
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next()
}