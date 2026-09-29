const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { transcribeAudio } = require("../services/voskService");

const router = express.Router();

const upload = multer({
    dest: path.join(__dirname, "../temp")
});

router.post("/transcribe-audio", upload.single("audio"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No audio file received"
            });
        }

        const text = await transcribeAudio(req.file.path);

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            transcript: text
        });

    } catch (error) {

        console.log("Speech transcription failed:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;