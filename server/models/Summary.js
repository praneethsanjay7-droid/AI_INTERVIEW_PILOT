const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true,
        unique: true
    },

    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    strengths: {
        type: String,
        default: ""
    },

    weaknesses: {
        type: String,
        default: ""
    },

    technicalAssessment: {
        type: String,
        default: ""
    },

    overallAssessment: {
        type: String,
        default: ""
    },

    recommendation: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Summary", summarySchema);