const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Buyer = require('../../models/buyer');
const Seller = require('../../models/seller');

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check both collections
    const buyer = await Buyer.findOne({ email });
    const seller = await Seller.findOne({ email });
    const user = buyer || seller;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.constructor.modelName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      role: user.constructor.modelName,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { signin };