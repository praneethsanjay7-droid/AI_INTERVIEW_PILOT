const express = require("express");
const path = require("path");

const { transcribeAudio } = require("../services/voskService");

const router = express.Router();

router.get("/test-vosk", async (req, res) => {

    try {

        const audioPath = path.join(
            __dirname,
            "../../../vosk-test/sample-speech-1m.wav"
        );

        const text = await transcribeAudio(audioPath);

        res.json({
            success: true,
            transcript: text
        });

    } catch (error) {

        console.log("Vosk test failed:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;