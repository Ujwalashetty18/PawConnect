const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");

// Anyone logged in can put their pet up for adoption
router.post("/", protect, upload.single("image"), addPet);

// Anyone logged in can view pets
router.get("/", protect, getPets);

router.get("/:id", protect, getPetById);

// We will fix owner checking later
router.put("/:id", protect, upload.single("image"), updatePet);

router.delete("/:id", protect, deletePet);

module.exports = router;
