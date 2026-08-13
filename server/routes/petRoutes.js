const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");

router.post("/", protect, addPet);
router.get("/", protect, getPets);
router.get("/:id", protect, getPetById);
router.put("/:id", protect, updatePet);
router.delete("/:id", protect, deletePet);

module.exports = router;
