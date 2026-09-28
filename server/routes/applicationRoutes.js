const express = require("express");

const {
    showAvailableJobs,
    showApplyPage,
    applyForJob,
    showApplicants,
    showMyApplications
} = require("../controllers/applicationController");

const upload = require("../config/multer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/available-jobs", protect, showAvailableJobs);

router.get("/apply/:jobId", protect, showApplyPage);

router.post(
    "/apply/:jobId",
    protect,
    upload.single("resume"),
    applyForJob
);

router.get(
    "/jobs/:jobId/applicants",
    protect,
    showApplicants
);

router.get(
    "/my-applications",
    protect,
    showMyApplications
);

module.exports = router;