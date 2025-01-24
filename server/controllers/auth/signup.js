const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Buyer = require("../../models/buyer");
const Seller = require("../../models/seller");

const signup = asyncHandler(async (req, res) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res
      .status(400)
      .json({ message: "Role, email, and password are required." });
  }

  if (role !== "buyer" && role !== "seller") {
    return res
      .status(400)
      .json({ message: "Invalid role. Must be 'buyer' or 'seller'." });
  }

  try {
    const existingUser =
      role === "buyer"
        ? await Buyer.findOne({ email })
        : await Seller.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (role === "buyer") {
      newUser = await Buyer.create({ email, password: hashedPassword });
    } else {
      newUser = await Seller.create({ email, password: hashedPassword });
    }

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully.`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
});

module.exports = { signup };
