const mongoose = require("mongoose");
const Schema =  mongoose.Schema;


const reviewSchema= new Schema({
     comment: {
        type: String,
        trim: true, // optional: remove extra whitespace
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
reviewSchema.index({ createdAt: -1 });

const Review=mongoose.model("Review",reviewSchema);
module.exports =Review