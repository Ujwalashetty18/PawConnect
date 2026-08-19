const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  addPet,
  getPets,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");

// ========================================
// ADD PET
// POST /api/pets
// ========================================
router.post("/", protect, upload.single("image"), addPet);

// ========================================
// GET ALL AVAILABLE PETS
// GET /api/pets
// ========================================
router.get("/", protect, getPets);

// ========================================
// GET MY PETS
// GET /api/pets/my-pets
// ========================================
router.get("/my-pets", protect, getMyPets);

// ========================================
// GET SINGLE PET
// GET /api/pets/:id
// ========================================
router.get("/:id", protect, getPetById);

// ========================================
// UPDATE PET
// PUT /api/pets/:id
// ========================================
router.put("/:id", protect, upload.single("image"), updatePet);

// ========================================
// DELETE PET
// DELETE /api/pets/:id
// ========================================
router.delete("/:id", protect, deletePet);

module.exports = router;
