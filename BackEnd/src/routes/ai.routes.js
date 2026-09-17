const express = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const aiController = require("../controllers/ai.controller")

const router = express.Router();


router.post("/get-review", authMiddleware, aiController.getReview)


module.exports = router;    