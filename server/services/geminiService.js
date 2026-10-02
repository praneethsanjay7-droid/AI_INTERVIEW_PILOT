const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const OLLAMA_URL = "http://localhost:11434/api/chat";
const QWEN_MODEL = "qwen3:4b";


// ----------------------------------------------------
// QWEN HELPER
// ----------------------------------------------------

const callQwen = async (prompt) => {

    console.log("Starting Ollama + Qwen...");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 300000); // 5 minutes

    try {

        const response = await fetch(
            OLLAMA_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: QWEN_MODEL,

                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],

                    stream: false,

                    format: "json",

                    think: false
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

        if (
            !data.message ||
            !data.message.content
        ) {
            throw new Error(
                "Qwen returned an empty response"
            );
        }

        return data.message.content.trim();

    } finally {

        clearTimeout(timeout);

    }
};


// ----------------------------------------------------
// FOLLOW-UP QUESTIONS - QWEN FALLBACK
// ----------------------------------------------------

const generateLocalFollowUpQuestions = async (transcript) => {

    const prompt = `
You are an AI assistant helping a technical interviewer.

Based on the candidate's interview response below,
generate exactly 3 relevant technical follow-up questions.

Candidate response:
"${transcript}"

Return ONLY valid JSON in this exact format:

{
    "questions": "1. Question one\\n2. Question two\\n3. Question three"
}
`;

    const text = await callQwen(prompt);

    const result = JSON.parse(text);

    if (!result.questions) {
        throw new Error(
            "Qwen returned no follow-up questions"
        );
    }

    return result.questions;
};


// ----------------------------------------------------
// FOLLOW-UP QUESTIONS - GEMINI + QWEN FALLBACK
// ----------------------------------------------------

const generateFollowUpQuestions = async (transcript) => {

    const prompt = `
You are an AI assistant helping a technical interviewer.

Based on the candidate's interview response below, generate
3 relevant technical follow-up questions.

Candidate response:
"${transcript}"

Return only the questions as a numbered list.
`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        if (
            !response ||
            !response.text ||
            !response.text.trim()
        ) {
            throw new Error(
                "Gemini returned an empty follow-up response"
            );
        }

        console.log(
            "Gemini follow-up questions generated successfully"
        );

        return response.text.trim();

    } catch (err) {

        console.log(
            "Gemini follow-up generation failed."
        );

        console.log(
            "Switching to Ollama + Qwen..."
        );

        console.log(err);

        return generateLocalFollowUpQuestions(
            transcript
        );

    }
};


// ----------------------------------------------------
// QWEN SUMMARY
// ----------------------------------------------------

const generateLocalSummary = async (prompt) => {

    const text = await callQwen(prompt);

    console.log("QWEN RAW SUMMARY:");
    console.log(text);

    const summary = JSON.parse(text);

    if (!summary) {
        throw new Error(
            "Qwen returned an empty summary"
        );
    }

    return {
        strengths: summary.strengths || "",
        weaknesses: summary.weaknesses || "",
        technicalAssessment:
            summary.technicalAssessment || "",
        overallAssessment:
            summary.overallAssessment || "",
        recommendation:
            summary.recommendation || ""
    };
};


// ----------------------------------------------------
// INTERVIEW SUMMARY - GEMINI + QWEN FALLBACK
// ----------------------------------------------------

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

{
    "strengths": "",
    "weaknesses": "",
    "technicalAssessment": "",
    "overallAssessment": "",
    "recommendation": ""
}
`;


    // -----------------------------------------------
    // TRY GEMINI
    // -----------------------------------------------

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            console.log(
                `Trying Gemini summary generation. Attempt ${attempt}/3`
            );

            const response =
                await ai.models.generateContent({

                    model: "gemini-2.5-flash",

                    contents: prompt,

                    config: {
                        responseMimeType:
                            "application/json"
                    }

                });


            if (
                !response ||
                !response.text ||
                !response.text.trim()
            ) {

                throw new Error(
                    "Gemini returned an empty summary"
                );

            }


            const text =
                response.text.trim();

            console.log(
                "GEMINI RAW SUMMARY:"
            );

            console.log(text);


            const summary =
                JSON.parse(text);


            return {
                strengths:
                    summary.strengths || "",

                weaknesses:
                    summary.weaknesses || "",

                technicalAssessment:
                    summary.technicalAssessment || "",

                overallAssessment:
                    summary.overallAssessment || "",

                recommendation:
                    summary.recommendation || ""
            };


        } catch (err) {

            console.log(
                `Gemini summary attempt ${attempt} failed:`,
                err.message
            );


            // If Gemini returned invalid JSON,
            // do not retry endlessly.
            if (
                err instanceof SyntaxError
            ) {

                console.log(
                    "Gemini returned invalid JSON."
                );

                break;

            }


            // Retry temporary Gemini failures
            if (
                err.status === 503 &&
                attempt < 3
            ) {

                console.log(
                    `Gemini temporarily unavailable. Retry ${attempt + 1}/3...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, 2000)
                );

                continue;

            }


            // For quota/rate-limit errors,
            // immediately switch to Qwen.

            if (
                err.status === 429
            ) {

                console.log(
                    "Gemini quota/rate limit reached."
                );

                break;

            }


            // Any other Gemini error also
            // goes to Qwen.

            break;

        }

    }


    // -----------------------------------------------
    // QWEN FALLBACK
    // -----------------------------------------------

    console.log(
        "Gemini summary unavailable."
    );

    console.log(
        "Switching to Ollama + Qwen..."
    );

    return generateLocalSummary(prompt);
};


// ----------------------------------------------------
// EXPORTS
// ----------------------------------------------------

module.exports = {
    generateFollowUpQuestions,
    generateInterviewSummary
};