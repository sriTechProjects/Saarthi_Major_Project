const express = require("express");
const { getRecommendations } = require("../../controllers/buyer/recommendations");
const router = express.Router();

router.post("/recommendations", getRecommendations);

module.exports = router;