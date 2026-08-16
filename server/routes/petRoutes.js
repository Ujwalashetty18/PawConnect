const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");

// Admin only
router.post("/", protect, admin, addPet);

// Logged-in users
router.get("/", protect, getPets);
router.get("/:id", protect, getPetById);

// Admin only
router.put("/:id", protect, admin, updatePet);
router.delete("/:id", protect, admin, deletePet);

module.exports = router;
