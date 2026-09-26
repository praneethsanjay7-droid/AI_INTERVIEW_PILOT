const express=require("express");

const {showCreateInterview,createInterview}=require("../controllers/interviewController");

const protect=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/create-interview",protect,showCreateInterview);
router.post("/create-interview",protect,createInterview);

module.exports=router;