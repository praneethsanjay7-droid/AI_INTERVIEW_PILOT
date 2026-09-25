const bcrypt=require("bcrypt");
const User=require("../models/User");
const jwt=require("jsonwebtoken");


const showRegister=(req,res)=>{
    res.render("register");
}

const registerUser=async(req,res)=>{
    try{
const { name, email, password, role } = req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.send("User already exists");
        }

        const hashedPassword=await bcrypt.hash(password,10);

       const user = new User({
        name,
        email,
        password: hashedPassword,
        role
        });
        await user.save();

        res.redirect("/");

    }catch(err){
        console.error(err);
        res.send("registration failed");
    }
};

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.send("Invalid email or password");
        }

        const passwordMatch=await bcrypt.compare(password,user.password);

        if (!passwordMatch) {
            return res.send("Invalid email or password");
        }

        const token=jwt.sign(
            {
                userId:user._id,
                email:user.email
            },
            "interviewpilot_secret",
            {
                expiresIn:"1d"
            }
        );

        res.cookie("token",token,{
            httpOnly:true
        });
        res.redirect("/dashboard");

    }catch(error){
        console.log(error);
        res.send("Login Failed");
    }
}

module.exports = {
    showRegister,
    registerUser,
    loginUser
};