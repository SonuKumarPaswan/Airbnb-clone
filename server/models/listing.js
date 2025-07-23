const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://www.shutterstock.com/image-illustration/futuristic-scifi-battle-space-ships-600nw-1825476242.jpg",
        set:(v)=> v === ""? "https://www.shutterstock.com/image-illustration/futuristic-scifi-battle-space-ships-600nw-1825476242.jpg":v,
    },
    price:Number,
    location: String,
    country:String
})
const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;