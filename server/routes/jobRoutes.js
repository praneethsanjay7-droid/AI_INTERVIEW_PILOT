const express=require("express");
const protect=require("../middleware/authMiddleware");
const router=express.Router();

router.get("/jobs",protect,(req,res)=>{
    res.send("Jobs page");
})

module.exports=router;