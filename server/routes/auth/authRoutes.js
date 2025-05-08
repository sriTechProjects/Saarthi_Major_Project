const express = require("express");
const { signup } = require("../../controllers/auth/signup");
const { signin } = require("../../controllers/auth/signin");
const TokenVerification = require("../../controllers/auth/checkToken");
const { forgotPassword_email_sender, otpVerification, newPasswordMaking } = require("../../controllers/auth/forget_password");
const router = express.Router();

// Register route
router.post("/signup", signup);

// Login route
router.post("/signin", signin);

// USER TOKEN VERIFICATION
router.get("/isToken", TokenVerification);

// POST /api/forgotpass
router.post("/forgotpass", forgotPassword_email_sender);

// Route to verify OTP sent to the user's email
router.post("/otpVerify/:email/:userType", otpVerification);

// Route to reset the password after OTP verification
router.post("/newPassword/:email/:userType", newPasswordMaking);
module.exports = router;
