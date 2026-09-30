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

Generate a structured interview summary with exactly these sections:

Strengths:
Weaknesses:
Technical Assessment:
Overall Assessment:
Recommendation:

Keep the summary factual and based only on the provided
transcript, notes, and evaluation.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
    });

    return response.text;
};


module.exports = {
    generateFollowUpQuestions,
    generateInterviewSummary
};