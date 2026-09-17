const Review = require("../models/review.model");

module.exports.getHistory = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user.userId })
    .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error("Failed to fetch review history:", error.message);
        res.status(500).send("Failed to fetch review history");
    }
};
module.exports.deleteReview = async (req, res) => {
    try {
        await Review.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
});

        res.json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete review:", error.message);
        res.status(500).send("Failed to delete review");
    }
};