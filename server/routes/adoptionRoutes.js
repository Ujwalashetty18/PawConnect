const express = require("express");
const router = express.Router();

const {
  createAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionStatus,
  deleteAdoptionRequest,
} = require("../controllers/adoptionController");

// Create adoption request
router.post("/", createAdoptionRequest);

// Get all adoption requests
router.get("/", getAdoptionRequests);

// Get adoption request by ID
router.get("/:id", getAdoptionRequestById);

// Update adoption status
router.put("/:id/status", updateAdoptionStatus);

// Delete adoption request
router.delete("/:id", deleteAdoptionRequest);

module.exports = router;
