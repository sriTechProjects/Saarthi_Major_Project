const express = require("express");
const { signup } = require("../../controllers/auth/signup");
const { signin } = require("../../controllers/auth/signin");
const TokenVerification = require("../../controllers/auth/checkToken");
const router = express.Router();

// Register route
router.post("/signup", signup);

// Login route
router.post("/signin", signin);

// USER TOKEN VERIFICATION
router.get("/isToken", TokenVerification);

module.exports = router;
