const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review=require("./review")

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
    country:String,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
    }
    ],
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})


const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;