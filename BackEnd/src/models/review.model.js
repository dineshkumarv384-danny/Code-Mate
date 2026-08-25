const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },

        language: {
            type: String,
            required: true,
        },

        review: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;