const Listing = require("../models/listing");

module.exports.index=(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing})
})
module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({
    path: "reviews",
    options: { sort: { createdAt: -1 } }, // latest reviews first
   populate:{ path:"author",}
  }).populate("owner");

  if(!listing){
    req.flash("error","Listing you requested  for doesn't exist ")
    throw new ExpressError(404,"Page not found")
    res.redirect("/listings")
  }
  console.log(listing)
    res.render("listings/show.ejs",{listing})
}

module.exports.addNewListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
}

module.exports.editListing=async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listings you requested  for does not exists!");
        res.redirect('/listings')
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl})
}

module.exports.updateListing=async(req,res)=>{
      let {id}=req.params;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await  listing.save();
    }

     req.flash("success","Listing Updated!")
    res.redirect(`/listings`) 
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
     req.flash("success","Listing deleted!")
    res.redirect("/listings")
}