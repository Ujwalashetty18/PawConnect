const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const donationRoutes = require("./routes/donationRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");

dotenv.config();

const app = express();

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= UPLOADS =================
// Make uploaded pet images accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/adoptions", adoptionRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🐾 Welcome to PawConnect API",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
