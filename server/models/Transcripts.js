const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    speaker: {
        type: String,
        enum: ["candidate", "interviewer"],
        required: true
    },

    text: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Transcript", transcriptSchema);