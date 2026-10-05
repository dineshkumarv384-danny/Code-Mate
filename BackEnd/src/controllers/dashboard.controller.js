const mongoose = require("mongoose");
const Review = require("../models/review.model");

module.exports.getDashboard = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const totalReviews = await Review.countDocuments({
            userId
        });

        const languageStats = await Review.aggregate([
            {
                $match: {
                    userId
                }
            },
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

        const recentReviews = await Review.find({
            userId
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("language createdAt");

        const reviewActivity = await Review.aggregate([
            {
                $match: {
                    userId
                }
            },
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

        // Calculate review severity statistics
        const reviews = await Review.find({
            userId
        }).select("review");

        let critical = 0;
        let warning = 0;
        let suggestion = 0;

        reviews.forEach((item) => {
            const reviewText = item.review || "";

            critical += (
                reviewText.match(/🔴\s*Critical/gi) || []
            ).length;

            warning += (
                reviewText.match(/🟠\s*Warning/gi) || []
            ).length;

            suggestion += (
                reviewText.match(/🔵\s*Suggestion/gi) || []
            ).length;
        });

        const severityStats = {
            critical,
            warning,
            suggestion
        };

        res.json({
            totalReviews,
            languageStats,
            recentReviews,
            reviewActivity,
            severityStats
        });

    } catch (error) {
        console.error(
            "Failed to fetch dashboard data:",
            error.message
        );

        res.status(500).send(
            "Failed to fetch dashboard data"
        );
    }
};