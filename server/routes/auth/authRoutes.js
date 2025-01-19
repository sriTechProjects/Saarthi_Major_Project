const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const { login } = require("../controllers/authController");

// Register route
router.post("/signup", register);

// Login route
router.post("/signin", login);

module.exports = router;
