const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateFollowUpQuestions = async (transcript) => {
    const prompt = `
You are an AI assistant helping a technical interviewer.

Based on the candidate's interview response below, generate
3 relevant technical follow-up questions.

Candidate response:
"${transcript}"

Return only the questions as a numbered list.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
    });

    return response.text;
};
const generateLocalSummary = async (prompt) => {

    console.log("Starting Ollama + Qwen...");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 120000); // 2 minutes

    try {

        const response = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen3:4b",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    stream: false,
                    format: "json"
                }),
                signal: controller.signal
            }
        );

        if (!response.ok) {
            throw new Error(
                `Ollama request failed with status ${response.status}`
            );
        }

        const data = await response.json();

        const text = data.message.content.trim();

        console.log("OLLAMA RAW SUMMARY:");
        console.log(text);

        const summary = JSON.parse(text);

        return {
            strengths: summary.strengths || "",
            weaknesses: summary.weaknesses || "",
            technicalAssessment: summary.technicalAssessment || "",
            overallAssessment: summary.overallAssessment || "",
            recommendation: summary.recommendation || ""
        };

    } finally {
        clearTimeout(timeout);
    }
};



const generateInterviewSummary = async (
    transcripts,
    notes,
    evaluation
) => {

    const transcriptText = transcripts
        .map(t => `${t.speaker}: ${t.text}`)
        .join("\n");

    const notesText = notes
        .map(n => n.text)
        .join("\n");

    const prompt = `
You are an AI assistant helping a technical interviewer
prepare a structured interview summary.

Use ONLY the interview information provided below.

INTERVIEW TRANSCRIPT:
${transcriptText}

INTERVIEWER NOTES:
${notesText}

EVALUATION:
Technical Skills: ${evaluation.technicalSkills}/5
Communication: ${evaluation.communication}/5
Problem Solving: ${evaluation.problemSolving}/5
Overall Rating: ${evaluation.overallRating}/5
Comments: ${evaluation.comments}

Create a concise interview summary.

Return the result as JSON with exactly these five fields:
- strengths
- weaknesses
- technicalAssessment
- overallAssessment
- recommendation
`;
let response;

for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        break;

    } catch (err) {

        if (err.status !== 503) {
            throw err;
        }

        console.log(
            `Gemini temporarily unavailable. Retry ${attempt}/3...`
        );

        if (attempt === 3) {
            console.log(
                "Gemini unavailable. Switching to Ollama + Qwen..."
            );

            return generateLocalSummary(prompt);
        }

        await new Promise(resolve =>
            setTimeout(resolve, 2000)
        );
    }
}


    const text = response.text.trim();

    const summary = JSON.parse(text);

    return {
        strengths: summary.strengths || "",
        weaknesses: summary.weaknesses || "",
        technicalAssessment: summary.technicalAssessment || "",
        overallAssessment: summary.overallAssessment || "",
        recommendation: summary.recommendation || ""
    };
};

module.exports = {
    generateFollowUpQuestions,
    generateInterviewSummary
};