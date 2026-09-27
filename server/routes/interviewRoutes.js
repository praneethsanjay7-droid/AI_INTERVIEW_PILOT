const express=require("express");

const {showCreateInterview,createInterview,showSchedulePage,scheduleInterview}=require("../controllers/interviewController");

const protect=require("../middleware/authMiddleware");

const router=express.Router();

// router.get("/create-interview",protect,showCreateInterview);
// router.post("/create-interview",protect,createInterview);


router.get("/schedule-interview/:applicationId",protect,showSchedulePage);

router.post("/schedule-interview/:applicationId",protect,scheduleInterview);

module.exports=router;