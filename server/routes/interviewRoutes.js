const express=require("express");

const {showCreateInterview,createInterview,showSchedulePage,scheduleInterview, showInterviewRoom,startInterview}=require("../controllers/interviewController");

const protect=require("../middleware/authMiddleware");

const router=express.Router();

// router.get("/create-interview",protect,showCreateInterview);
// router.post("/create-interview",protect,createInterview);


router.get("/schedule-interview/:applicationId",protect,showSchedulePage);

router.post("/schedule-interview/:applicationId",protect,scheduleInterview);

router.get(
    "/interview-room/:interviewId",
    protect,
    showInterviewRoom
)
router.post(
    "/interview-room/:interviewId/start",
    protect,
    startInterview
);

module.exports=router;