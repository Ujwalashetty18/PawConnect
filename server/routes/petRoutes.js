const express = require("express");
const router = express.Router();

const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");

router.post("/", addPet);
router.get("/", getPets);
router.get("/:id", getPetById);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

module.exports = router;
