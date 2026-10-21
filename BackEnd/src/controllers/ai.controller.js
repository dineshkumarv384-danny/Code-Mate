const aiService = require("../services/ai.service")
const Review = require("../models/review.model");


module.exports.getReview = async (req, res) => {

    const userId = req.user.userId;
    const code = req.body.code;
    const language = req.body.language;

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    const response = await aiService(code, language);

    await Review.create({
        code,
        language,
        review: response,
        userId,
    });

    res.send(response);

}
module.exports.generateAnswer = async (req, res) => {
    try {
        const { prompt, language } = req.body;

const promptLanguage = prompt.match(
    /\b(javascript|js|python|py|java|c\+\+|cpp|c)\b/i
)?.[1]?.toLowerCase();

const languageMap = {
    javascript: "javascript",
    js: "javascript",
    python: "python",
    py: "python",
    java: "java",
    "c++": "cpp",
    cpp: "cpp",
    c: "cpp"
};

const selectedLanguage = languageMap[promptLanguage] || language || "javascript";

        if (!prompt || !prompt.trim()) {
            return res.status(400).send("Prompt is required");
        }

        const response = await aiService(
            `You are Code-Mate, a helpful programming assistant for beginners.

User request: ${prompt}

Preferred programming language: ${selectedLanguage}

Instructions:
1. Explain the solution in beginner-friendly language.
2. Provide working code in the requested language when appropriate.
3. Format code using Markdown code blocks with the correct language identifier.
4. Briefly explain how the code works.
5. If the request is unrelated to programming, politely guide the user toward programming-related help.`,
           selectedLanguage
        );

        return res.send(response);
    } catch (error) {
        console.error("Answer generation failed:", error);
        return res.status(500).send("Failed to generate an answer. Please try again.");
    }
};