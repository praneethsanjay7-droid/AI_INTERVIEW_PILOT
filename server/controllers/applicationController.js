const Job = require("../models/Job");
const Interview=require("../models/Interview")
const Application=require("../models/Application");
const cloudinary=require("../config/cloudinary");

const showApplyPage=async(req,res)=>{
    try{
        const job=await Job.findById(req.params.jobId);

        if(!job){
            return res.send("Job not found");
        }
        res.render("apply-for",{job});

    }catch(err){
        console.log(err);
        res.send("Failed to load the application page");
    }
}

const applyForJob=async(req,res)=>{
    try{
        const job=await Job.findById(req.params.jobId);

        if(!job){
            return res.send("Job not found");
        }

        if(!req.file){
            return res.send("Please upload your resume");
        }

        const existingApplication=await Application.findOne({
            candidate:req.user.userId,
            job:job._id
        });

        if(existingApplication){
            return res.send("You have already applied for this job");
        }

        const result=await new Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream(
            {
                    resource_type:"raw",
                folder:"interviewpilot/resumes"
            },
            (error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            }
            );
            stream.end(req.file.buffer);
        })

        const application =new Application({
            candidate:req.user.userId,
            job:job._id,
            resumeUrl:result.secure_url
        });
        await application.save()
        res.send("Application submitted successfully");
    }catch(err){
        console.log(err);
        res.send("Application failed");
    }
}

const showAvailableJobs=async(req,res)=>{
    try{
        const jobs=await Job.find({
            status:"open"
        }).sort({createdAt:-1});

        res.render("application-jobs",{jobs});
    }catch(err){
        console.log(err);
        res.status(500).send("Failed to load available jobs");
    }
}

const showApplicants = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.jobId,
            createdBy: req.user.userId
        });

        if (!job) {
            return res.send("Job not found or you are not authorized");
        }

        const applications = await Application.find({
            job: job._id
        }).populate("candidate", "name email");

        res.render("applicants", {
            job,
            applications
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to load applicants");
    }
};

const showMyApplications = async (req, res) => {
    try {

        const applications = await Application.find({
            candidate: req.user.userId
        })
        .populate("job")
        .sort({ createdAt: -1 });

        const interviews = await Interview.find({
            interviewer: { $exists: true }
        }).populate({
            path: "application",
            populate: {
                path: "candidate"
            }
        });

        const myInterviews = interviews.filter(interview =>
            interview.application &&
            interview.application.candidate &&
            interview.application.candidate._id.toString() ===
            req.user.userId
        );

        res.render("my-applications", {
            applications: applications,
            interviews: myInterviews
        });

    } catch (err) {

        console.log(err);
        res.status(500).send("Failed to load applications");

    }
};
module.exports={
    showAvailableJobs,
    showApplyPage,
    applyForJob,
    showApplicants,
    showMyApplications
};