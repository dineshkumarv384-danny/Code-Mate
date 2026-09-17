const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/dashboard", authMiddleware, dashboardController.getDashboard);

module.exports = router;