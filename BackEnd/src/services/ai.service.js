const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: `
You are a senior code reviewer helping beginners learn programming.

Review the code provided by the user.

Give your response in this structure:

1. Overall Assessment
2. Errors and Bugs
3. Code Quality Issues
4. Performance Improvements
5. Security Issues
6. Beginner-Friendly Explanation
7. Improved Code

Be clear and educational. Explain WHY an issue exists rather than only pointing it out.
If the code is already good, say so and suggest possible improvements.
`
});

async function aiService(code) {
    const prompt = `
Review the following code:

\`\`\`
${code}
\`\`\`

Provide a beginner-friendly code review following the requested structure.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
}

module.exports = aiService;