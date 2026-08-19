const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionStatus,
} = require("../controllers/adoptionController");

// User submits adoption request
router.post("/", protect, createAdoptionRequest);

// Pet owner or admin can view requests
router.get("/", protect, getAdoptionRequests);

// Pet owner or admin can view one request
router.get("/:id", protect, getAdoptionRequestById);

// Pet owner or admin can approve/reject
router.put("/:id/status", protect, updateAdoptionStatus);

module.exports = router;
