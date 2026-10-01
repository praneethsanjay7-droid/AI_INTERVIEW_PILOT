const Interview = require("../models/Interview");
const Job = require("../models/Job");

const showDashboard = async (req, res) => {
    try {
        let interviews = [];
        let jobs = [];

        if (req.user.role === 'candidate') {
            // Candidates should see all open jobs on their dashboard
            jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
            // Note: Candidate interviews are normally tracked through their applications, 
            // but we pass an empty array here since the dashboard expects it
        } else {
            // Interviewers see jobs they created and interviews they are hosting
            interviews = await Interview.find({
                interviewer: req.user.userId
            }).sort({ createdAt: -1 });

            jobs = await Job.find({
                createdBy: req.user.userId
            }).sort({ createdAt: -1 });
        }

        res.render("dashboard", {
            interviews,
            jobs
        });

    } catch (err) {
        console.error(err);
        res.send("Failed to load dashboard");
    }
};

module.exports = {
    showDashboard
};