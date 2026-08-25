const aiService = require("../services/ai.service")
const Review = require("../models/review.model");


module.exports.getReview = async (req, res) => {

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
    });

    res.send(response);

}