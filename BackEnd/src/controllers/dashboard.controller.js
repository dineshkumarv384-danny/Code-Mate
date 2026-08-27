const Review = require("../models/review.model");

module.exports.getDashboard = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();

        const languageStats = await Review.aggregate([
            {
                $group: {
                    _id: "$language",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const recentReviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("language createdAt");
            const reviewActivity = await Review.aggregate([
    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                }
            },
            count: { $sum: 1 }
        }
    },
    {
        $sort: { _id: 1 }
    }
]);

        res.json({
            totalReviews,
            languageStats,
            recentReviews,
            reviewActivity
        });
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error.message);
        res.status(500).send("Failed to fetch dashboard data");
    }
};