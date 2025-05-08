const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Buyer = require("../../models/buyer");
const Seller = require("../../models/seller");
const sendEmail = require("../../config/mailSetup");

const otpStore = new Map(); // { 'email|userType': { otp: '123456', expiry: 17123456789 } }

const randomOtpGenerator = () => Math.floor(100000 + Math.random() * 900000);

const getUserModel = (type) => {
  if (type === "buyer") return Buyer;
  if (type === "seller") return Seller;
  throw new Error("Invalid user type.");
};

// /api/forgotpass
const forgotPassword_email_sender = asyncHandler(async (req, res) => {
  try {
    const { email, userType } = req.body;
    if (!email || !userType) return res.status(400).json({ message: "Email and user type are required." });

    const UserModel = getUserModel(userType);
    const existingUser = await UserModel.findOne({ "email": email });
    if (!existingUser) return res.status(404).json({ message: "User not found." });

    const otp = randomOtpGenerator();
    const to = email;
    const subject = "Reset Your Password";

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Saarthi - Reset Password</h2>
        <p>Your OTP is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #0077b6;">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    const response = await sendEmail(to, subject, html);

    if (response.success) {
      const key = `${email}|${userType}`;
      otpStore.set(key, { otp: otp.toString(), expiry: Date.now() + 10 * 60 * 1000 });
      return res.status(200).json({ message: "Password reset email sent successfully." });
    } else {
      throw new Error(response.message || "Failed to send the email.");
    }
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Failed to send password reset email." });
  }
});

// /api/otpVerify/:email/:userType
const otpVerification = asyncHandler(async (req, res) => {
  const { email, userType } = req.params;
  const { otp } = req.body;
  const key = `${email}|${userType}`;

  try {
    if (!otp) return res.status(400).json({ message: "OTP is required." });

    const storedOtpObj = otpStore.get(key);

    if (!storedOtpObj) return res.status(404).json({ message: "No OTP found for this request." });
    if (Date.now() > storedOtpObj.expiry) {
      otpStore.delete(key);
      return res.status(400).json({ message: "OTP has expired." });
    }

    if (storedOtpObj.otp === otp.toString()) {
      otpStore.delete(key); // Invalidate after use
      return res.status(200).json({ message: "OTP validated successfully." });
    } else {
      return res.status(401).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    res.status(500).json({ message: "Failed to verify OTP." });
  }
});

// /api/newPassword/:email/:userType
const newPasswordMaking = asyncHandler(async (req, res) => {
  const { email, userType } = req.params;
  const { newPassword, newConfirmPassword } = req.body;

  try {
    if (newPassword !== newConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const UserModel = getUserModel(userType);
    const existingUser = await UserModel.findOne({ "email": email });
    if (!existingUser) return res.status(404).json({ message: "User not found." });

    const newHashedPassword = bcrypt.hashSync(newPassword, 10);
    existingUser.password = newHashedPassword;
    await existingUser.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("New Password Error:", error.message);
    res.status(500).json({ message: "Failed to update password." });
  }
});

module.exports = {
  forgotPassword_email_sender,
  otpVerification,
  newPasswordMaking,
};
