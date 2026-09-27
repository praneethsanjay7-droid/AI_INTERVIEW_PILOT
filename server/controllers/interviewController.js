const Interview = require("../models/Interview");
const Application=require("../models/Application");
const Job=require("../models/Job");

const showCreateInterview = (req, res) => {
    res.render("create-interview");
};

const createInterview = async (req, res) => {
    try {
        const {
            candidateName,
            candidateEmail,
            position
        } = req.body;

        const interview = new Interview({
            interviewer: req.user.userId,
            candidateName,
            candidateEmail,
            position
        });

        await interview.save();

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.send("Failed to create interview");
    }
};
const showSchedulePage=async(req,res)=>{
    try{
        const application=await Application.findById(req.params.applicationId)
        .populate("candidate","name email")
        .populate("job","title");

        if(!application){
            return res.send("Application not found");
        }

        const job =await Job.findOne({
            _id:application.job._id,
            createdBy:req.user.userId
        });

        if(!job){
            return res.send("Ypu are not authorised to schedule this interview");
        }

        res.render("schedule-interview",{
            application
        });

    }catch(err){
        console.log(err);
        res.status(500).send("Failed to load scheduling page");
    }
};

const scheduleInterview=async(req,res)=>{
    try{
        const application=await Application.findById(req.params.applicationId);

        if(!application){
            return res.send("Application not found");
        }

        const job=await Job.findOne({
            _id:application.job,
            createdBy:req.user.userId        })
    

    if(!job){
    return res.semd("YOu are not authorised to schedule this interview");
    }

    const {scheduledAt}=req.body;

    if(!scheduledAt){
        return res.send("Please select an interview date and time");
    }

    const existingInterview=await Interview.findOne({
        application:application._id,
        status:{
            $in:["schdeuled","ongoing"]
        }
    });
    if(existingInterview){
        return res.send("An interview is already scheduled for this candidate");
    }

    const interview=new Interview({
        application:application._id,
        interviewer:req.user.userId,
        scheduledAt
    });

    await interview.save();

    application.status="shortlisted";
    await application.save();

    res.send("interview scheduled successfully");
}catch(err){
    console.log(err);
    res.status(500).send("Failed to schedule interview");
}
}
module.exports = {
    showCreateInterview,
    createInterview,
    showSchedulePage,
    scheduleInterview
};