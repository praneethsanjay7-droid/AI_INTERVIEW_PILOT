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

module.exports = {
    generateFollowUpQuestions
};