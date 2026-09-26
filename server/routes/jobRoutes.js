const express = require("express");

const {
    showCreateJob,
    createJob,
    showJobs
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/jobs", protect, showJobs);

router.get("/create-job", protect, showCreateJob);

router.post("/create-job", protect, createJob);

module.exports = router;