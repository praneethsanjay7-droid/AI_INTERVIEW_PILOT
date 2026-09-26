const Interview=require("../models/Interview");

const showDashboard=async(req,res)=>{
    try{
        const interviews=await Interview.find({
            interviewer:req.user.userId
        }).sort({createdAt:-1});

        res.render("dashboard",{
            interviews
        });

    }catch(err){
        console.error(err);
        res.send("Failed to load dashboard");
    }
};

module.exports={
    showDashboard
};