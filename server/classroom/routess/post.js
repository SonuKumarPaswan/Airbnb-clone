const express=require("express");
const router= express.Router();

//  Post router 
// index
router.get("/",(req,res)=>{
    res.send("post router")
})
// show
router.get("/:id",(req,res)=>{
    res.send("show router")
})
// post
router.post("/",(req,res)=>{
    res.send("post  router")
})
// delete
router.delete("/",(req,res)=>{
    res.send("post delete router")
})


module.exports=router;