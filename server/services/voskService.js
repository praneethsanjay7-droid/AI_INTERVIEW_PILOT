const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const ffmpegPath = process.env.FFMPEG_PATH || String.raw`C:\Users\prane\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe`;

const transcribeAudio = async (audioPath) => {
    const convertedPath = path.join(
        path.dirname(audioPath),
        `${path.basename(audioPath)}.wav`
    );

    try {
        // Convert audio to WAV format
        await execFileAsync(ffmpegPath, [
            "-y",
            "-i",
            audioPath,
            "-ar",
            "16000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            convertedPath
        ]);

        console.log("Audio converted to WAV:", convertedPath);

        // Read converted WAV
        const audio = fs.readFileSync(convertedPath);

        const formData = new FormData();

        const blob = new Blob(
            [audio],
            { type: "audio/wav" }
        );

        formData.append(
            "audio",
            blob,
            "audio.wav"
        );

        const response = await fetch(
            "http://127.0.0.1:7000/transcribe",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(
                `Vosk service returned ${response.status}`
            );
        }
const result = await response.json();

console.log("Vosk response:", result);

return result.text;
    }finally {
    if (fs.existsSync(convertedPath)) {
        fs.unlinkSync(convertedPath);
    }
}
};

module.exports = {
    transcribeAudio
};

// $listener = Get-NetTCPConnection -LocalPort 5000 -State Listen
// Stop-Process -Id $listener.OwningProcess -Force
