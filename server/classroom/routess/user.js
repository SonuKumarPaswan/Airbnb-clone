const express=require("express");
const router= express.Router();

//  User router 
// index
router.get("/",(req,res)=>{
    res.send("User router")
})
// show
router.get("/:id",(req,res)=>{
    res.send("user id router")
})
// post
router.post("/",(req,res)=>{
    res.send("User router")
})
// delete
router.delete("/",(req,res)=>{
    res.send("User delete router")
})


module.exports=router;