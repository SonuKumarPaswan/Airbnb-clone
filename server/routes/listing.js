 const express=require("express");
 const router=express.Router();
 const Listing=require("../models/listing")
 const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, saveOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage}=require("../CloudConfig.js")
const upload = multer({storage})


router.route("/")
.get(  wrapAsync(
    listingController.
    index)
  )
  .post(
     isLoggedIn,
     upload.single('listing[image]'),
      validateListing , 
       wrapAsync(
        listingController.
        addNewListing)
    )

// New Routes 
router.get("/news",
    isLoggedIn,
    listingController.
    renderNewForm
  )

// show routes 
// Update Listing
// delete routes
router.route("/:id")
.get(wrapAsync(
    listingController.
    showListing)
  )
.put(
    isLoggedIn,
    saveOwner,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(
        listingController.
        updateListing)
    )
    .delete(
    isLoggedIn,
    wrapAsync(
        listingController.
        deleteListing)
)
// Edit routes
router.get("/:id/edit",
    isLoggedIn,
    saveOwner,
    wrapAsync(
        listingController.
        editListing)
  )

module.exports=router;