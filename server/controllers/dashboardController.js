const Interview = require("../models/Interview");
const Job = require("../models/Job");

const showDashboard = async (req, res) => {
    try {
        const interviews = await Interview.find({
            interviewer: req.user.userId
        }).sort({ createdAt: -1 });

        const jobs = await Job.find({
            createdBy: req.user.userId
        }).sort({ createdAt: -1 });

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