const Job = require("../models/Job");

const showCreateJob = (req, res) => {
    res.render("create-job");
};

const createJob = async (req, res) => {
    try {
        const { title, description } = req.body;

        const job = new Job({
            title,
            description,
            createdBy: req.user.userId
        });

        await job.save();

        res.redirect("/jobs");

    } catch (error) {
        console.error(error);
        res.send("Failed to create job");
    }
};

const showJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            createdBy: req.user.userId
        }).sort({ createdAt: -1 });

        res.render("jobs", {
            jobs
        });

    } catch (error) {
        console.error(error);
        res.send("Failed to load jobs");
    }
};
module.exports = {
    showCreateJob,
    createJob,
    showJobs
};