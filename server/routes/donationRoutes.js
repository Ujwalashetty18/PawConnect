const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createDonation,
  getDonations,
  getDonationById,
} = require("../controllers/donationController");

// Logged-in users can create donations
router.post("/", protect, createDonation);

// Admin only
router.get("/", protect, admin, getDonations);

router.get("/:id", protect, admin, getDonationById);

module.exports = router;
