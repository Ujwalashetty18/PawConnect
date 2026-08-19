const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", protect, getMe);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

router.put("/change-password", protect, changePassword);

router.delete("/account", protect, deleteAccount);

module.exports = router;
