require("dotenv").config();
const express = require("express");

const app = express();
const authRoutes = require("./routes/auth/authRoutes");

app.use(express.json());
app.use("/api/saarthi/auth", authRoutes);

const PORT = process.env.PORT || 8000;
const Connection = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`~ Server [${PORT}][OK]`);
    });
  } catch (error) {
    console.log("Unable to Make A Connection");
    process.exit(1);
  }
};

Connection();
