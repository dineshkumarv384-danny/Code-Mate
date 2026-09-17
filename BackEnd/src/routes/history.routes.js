const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const historyController = require("../controllers/history.controller");

const router = express.Router();

router.get("/history", authMiddleware, historyController.getHistory);
router.delete("/history/:id", authMiddleware, historyController.deleteReview);

module.exports = router;