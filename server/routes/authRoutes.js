const express=require("express");

const {showRegister,registerUser,loginUser}=require("../controllers/authControllers");

const router=express.Router();

router.get("/register",showRegister);
router.post("/register",registerUser);

router.post("/login",loginUser);

module.exports=router;