const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionStatus,
} = require("../controllers/adoptionController");

// =====================================================
// CREATE ADOPTION REQUEST
// POST /api/adoptions
// =====================================================

router.post("/", protect, createAdoptionRequest);

// =====================================================
// GET MY SENT + RECEIVED REQUESTS
// GET /api/adoptions
// =====================================================

router.get("/", protect, getAdoptionRequests);

// =====================================================
// GET SINGLE REQUEST
// GET /api/adoptions/:id
// =====================================================

router.get("/:id", protect, getAdoptionRequestById);

// =====================================================
// APPROVE / REJECT REQUEST
// PUT /api/adoptions/:id/status
// =====================================================

router.put("/:id/status", protect, updateAdoptionStatus);

module.exports = router;
