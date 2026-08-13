const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createDonation,
  getDonations,
  getDonationById,
} = require("../controllers/donationController");

// Create donation
router.post("/", protect, createDonation);

// Get all donations
router.get("/", protect, getDonations);

// Get donation by ID
router.get("/:id", protect, getDonationById);

module.exports = router;
