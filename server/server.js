const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const donationRoutes = require("./routes/donationRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/adoptions", adoptionRoutes);
// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🐾 Welcome to PawConnect API",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
