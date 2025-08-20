const express=require("express");
const router = express.Router({ mergeParams: true });
const Listing=require("../models/listing")
const wrapAsync = require('../utils/wrapAsync');
const {listingSchema , reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


// Review
// Post Routes 
router.post("/" , 
  isLoggedIn,
  validateReview,
   wrapAsync(
    reviewController.
    createReview
   )
 )

// Delete review route
router.delete("/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.
    destroyReview
  ))

module.exports=router;