const express = require("express");
const router = express.Router();

const {
  createDonation,
  getDonations,
  getDonationById,
} = require("../controllers/donationController");

// Create donation
router.post("/", createDonation);

// Get all donations
router.get("/", getDonations);

// Get donation by ID
router.get("/:id", getDonationById);

module.exports = router;
