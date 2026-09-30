const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    technicalSkills: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    communication: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    problemSolving: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    overallRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comments: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});
evaluationSchema.index(
    { interview: 1 },
    { unique: true }
);


module.exports = mongoose.model("Evaluation", evaluationSchema);