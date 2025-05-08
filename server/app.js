require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbSetup");
const cookieParser = require("cookie-parser");
const path = require('path');

const app = express();
const authRoutes = require("./routes/auth/authRoutes");
const productRoutes = require("./routes/buyer/getProducts");
const recommendationsRoutes = require("./routes/buyer/recommends");
const commonRoutes = require("./routes/common/common");
const ProductsRoutes = require("./routes/products/seller_Routes");

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/saarthi/auth", authRoutes);
app.use("/api/saarthi/products", productRoutes);  // customer side
app.use("/api/saarthi/", recommendationsRoutes);
app.use("/api/saarthi/comm", commonRoutes);
app.use("/api/saarthi/product", ProductsRoutes);  // seller side

const PORT = process.env.PORT || 8000;


const startConnection = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startConnection();