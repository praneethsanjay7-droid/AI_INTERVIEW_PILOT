const express=require("express");

const{showDashboard}=require("../controllers/dashboardController");

const protect=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/dashboard",protect,showDashboard);
module.exports=router;