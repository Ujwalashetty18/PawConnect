const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionStatus,
} = require("../controllers/adoptionController");

// User submits adoption request
router.post("/", protect, createAdoptionRequest);

// Admin views requests
router.get("/", protect, admin, getAdoptionRequests);

// Admin/views individual request
router.get("/:id", protect, admin, getAdoptionRequestById);

// Admin approves/rejects request
router.put("/:id/status", protect, admin, updateAdoptionStatus);

module.exports = router;
