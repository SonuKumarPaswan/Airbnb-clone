const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const methodOverride = require("method-override");



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


app.get("/",(req,res)=>{
    res.send("Hi, i am room")
})

app.get("/listings", async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing})
})

// New Routes 
app.get("/listings/news",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings", async (req,res)=>{
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})
// Edit routes
app.get("/listings/:id/edit",async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findById(id);
    console.log(listing)
    res.render("listings/edit.ejs",{listing})
})
 app.put("/listings/:id",async(req,res)=>{
      let {id}=req.params;
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(listing)
    res.redirect(`/listings/${id}`) 
})
// delete routes
app.delete("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})
// show routes 
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    console.log(listing)
})


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

app.listen(8080,()=>{
    console.log("listening port on 8080")
})
