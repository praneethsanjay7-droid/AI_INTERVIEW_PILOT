const Interview = require("../models/Interview");
const Application=require("../models/Application");
const Job=require("../models/Job");
const Transcript=require("../models/Transcripts");
const mongoose=require("mongoose");

const isOwnedBy = (ownerId, userId) =>
    ownerId && ownerId.toString() === userId.toString();

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
        if (!mongoose.isValidObjectId(req.params.applicationId)) {
            return res.status(404).send("Application not found");
        }

        const application=await Application.findById(req.params.applicationId)
        .populate("candidate","name email")
        .populate("job","title createdBy");

        if(!application){
            return res.status(404).send("Application not found");
        }

        if(!application.job || !isOwnedBy(application.job.createdBy, req.user.userId)){
            return res.status(403).send("You are not authorized to schedule this interview");
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
        if (!mongoose.isValidObjectId(req.params.applicationId)) {
            return res.status(404).send("Application not found");
        }

        const application=await Application.findById(req.params.applicationId);

        if(!application){
            return res.status(404).send("Application not found");
        }

        const job=await Job.findOne({
            _id:application.job,
            createdBy:req.user.userId        })


    if(!job){
    return res.status(403).send("You are not authorized to schedule this interview");
    }

    const {scheduledAt}=req.body;

    if(!scheduledAt){
        return res.send("Please select an interview date and time");
    }

    const existingInterview=await Interview.findOne({
        application:application._id,
        status:{
            $in:["scheduled","ongoing"]
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

res.redirect(`/interview-room/${interview._id}`);
}catch(err){
    console.log(err);
    if (err.code === 11000) {
        return res.send("An interview is already scheduled for this candidate");
    }
    res.status(500).send("Failed to schedule interview");
}
}

const showInterviewRoom = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.interviewId)) {
            return res.status(404).send("Interview not found");
        }

        const interview = await Interview.findById(req.params.interviewId)
        .populate({
            path: "application",
            populate: [
                {
                    path: "candidate",
                    select: "name email"
                },
                {
                    path: "job",
                    select: "title description createdBy"
                }
            ]
        });

        if (!interview) {
            return res.status(404).send("Interview not found");
        }

        if (
            !isOwnedBy(interview.interviewer, req.user.userId) ||
            !interview.application ||
            !interview.application.job ||
            !isOwnedBy(interview.application.job.createdBy, req.user.userId)
        ) {
            return res.status(403).send("You are not authorized for this interview");
        }
        const transcripts = await Transcript.find({
    interview: interview._id
}).sort({ timestamp: 1 });

      res.render("interview-room", {
    interview: interview,
    transcripts: transcripts
});

    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to load interview room");
    }
};


const showCandidateInterviewRoom = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.interviewId)) {
            return res.status(404).send("Interview not found");
        }

        const interview = await Interview.findById(
            req.params.interviewId
        )
        .populate({
            path: "application",
            populate: [
                {
                    path: "candidate"
                },
                {
                    path: "job"
                }
            ]
        });

        if (!interview) {
            return res.status(404).send("Interview not found");
        }

        if (
            !interview.application ||
            !interview.application.candidate ||
            !isOwnedBy(interview.application.candidate._id, req.user.userId)
        ) {
            return res.status(403).send("You are not authorized for this interview");
        }

        res.render("candidate-interview", {
            interview: interview
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to load interview");
    }
};


const startInterview = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.interviewId)) {
            return res.status(404).send("Interview not found");
        }

        const interview = await Interview.findById(req.params.interviewId)
        .populate({
            path: "application",
            populate: {
                path: "job",
                select: "createdBy"
            }
        });


        if (!interview) {
            return res.status(404).send("Interview not found");
        }

        if (
            !isOwnedBy(interview.interviewer, req.user.userId) ||
            !interview.application ||
            !interview.application.job ||
            !isOwnedBy(interview.application.job.createdBy, req.user.userId)
        ) {
            return res.status(403).send("You are not authorized for this interview");
        }

        if (interview.status === "ongoing") {
    return res.redirect(`/interview-room/${interview._id}`);
}

if (interview.status !== "scheduled") {
    return res.send("Interview cannot be started");
}

        const currentTime = new Date();

        if (currentTime < interview.scheduledAt) {
            return res.send(
                "Interview cannot be started before the scheduled time"
            );
        }

        interview.status = "ongoing";

        await interview.save();

        res.redirect(`/interview-room/${interview._id}`);

    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to start interview");
    }
};



module.exports = {
    showCreateInterview,
    createInterview,
    showSchedulePage,
    scheduleInterview,
    showInterviewRoom,
    startInterview,
    showCandidateInterviewRoom
};
