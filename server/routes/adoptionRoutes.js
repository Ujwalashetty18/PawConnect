const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionStatus,
  deleteAdoptionRequest,
} = require("../controllers/adoptionController");

// Create adoption request
router.post("/", protect, createAdoptionRequest);

// Get all adoption requests
router.get("/", protect, getAdoptionRequests);

// Get adoption request by ID
router.get("/:id", protect, getAdoptionRequestById);

// Update adoption status
router.put("/:id/status", protect, admin, updateAdoptionStatus);

// Delete adoption request
router.delete("/:id", protect, deleteAdoptionRequest);

module.exports = router;
