const mongoose = require("mongoose");
const Job = require("./models/Job");

async function checkJobs() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/interviewpilot2"
        );

        console.log("MongoDB connected");

        const jobs = await Job.find(
            {},
            "title status createdAt"
        ).lean();

        console.log("\nALL JOBS:");
        console.log(JSON.stringify(jobs, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error("ERROR:");
        console.error(err);
    }
}

checkJobs();